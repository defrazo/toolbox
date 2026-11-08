import { useEffect, useRef, useState } from 'react';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';

import {
	compressImage,
	convertImage,
	inspectImage,
	normalizeBackgroundSettings,
	planResize,
	removeImageBackground,
	resizeImage,
} from '../lib';
import { IMAGES } from './constants';
import type {
	BackgroundRequest,
	BackgroundSettings,
	ImageError,
	ImageFile,
	ImageFormat,
	ImageWorkerRequest,
	Mode,
	ResizeSettings,
} from './types';

const IMAGE_ERRORS: ImageError[] = [
	'unsupported',
	'compressionUnsupported',
	'resizeUnsupported',
	'resizeSettings',
	'size',
	'pixels',
	'decode',
	'encode',
];

const errorCode = (error: unknown, fallback: ImageError): ImageError => {
	const code = error instanceof Error ? error.message : '';
	return IMAGE_ERRORS.includes(code as ImageError) ? (code as ImageError) : fallback;
};

const isSupportedFile = (file: File, mode: Mode) => {
	const accept = mode === 'converter' || mode === 'background' ? IMAGES.CONVERTER.ACCEPT : IMAGES.COMPRESSION.ACCEPT;
	const extension = `.${file.name.split('.').pop()?.toLowerCase()}`;

	return accept.split(',').includes(extension);
};

export const useImages = (notify: (error: ImageError | 'limit' | 'download') => void, mode: Mode = 'converter') => {
	const [files, setFiles] = useState<ImageFile[]>([]);
	const [format, setFormatState] = useState<ImageFormat>('png');
	const [quality, setQualityState] = useState(80);
	const [activeBackgroundId, setActiveBackgroundId] = useState<string | null>(null);
	const [resize, setResizeState] = useState<ResizeSettings>(IMAGES.RESIZE.DEFAULT);
	const [busy, setBusy] = useState(false);

	const resizeInitialized = useRef(false);
	const rows = useRef<ImageFile[]>([]);
	const locked = useRef(false);
	const mounted = useRef(true);
	const generation = useRef(0);
	const urls = useRef(new Set<string>());
	const worker = useRef<Worker | null>(null);
	const pending = useRef<((reason: Error) => void) | null>(null);
	const activeBackgroundFile =
		mode === 'background' ? (files.find((row) => row.id === activeBackgroundId) ?? files[0]) : undefined;

	useEffect(() => {
		mounted.current = true;
		const ownedUrls = urls.current;

		return () => {
			mounted.current = false;
			generation.current++;
			worker.current?.terminate();
			worker.current = null;
			pending.current?.(new Error('encode'));
			pending.current = null;
			ownedUrls.forEach((url) => URL.revokeObjectURL(url));
			ownedUrls.clear();
		};
	}, []);

	const update = (next: ImageFile[]) => {
		if (!mounted.current) return;

		rows.current = next;
		setFiles(next);
	};

	const patch = (id: string, value: Partial<ImageFile>) =>
		update(rows.current.map((row) => (row.id === id ? { ...row, ...value } : row)));

	const createUrl = (blob: Blob) => {
		const url = URL.createObjectURL(blob);
		urls.current.add(url);

		return url;
	};

	const release = (url?: string) => {
		if (!url) return;

		URL.revokeObjectURL(url);
		urls.current.delete(url);
	};

	const begin = () => {
		locked.current = true;
		setBusy(true);

		return ++generation.current;
	};

	const end = (operation: number) => {
		if (operation !== generation.current) return;

		locked.current = false;
		if (mounted.current) setBusy(false);
	};

	const addFiles = async (incoming: File[]) => {
		if (locked.current) return;

		const operation = begin();

		let total = rows.current.reduce((sum, row) => sum + row.file.size, 0);
		let limited = false;

		try {
			for (const file of incoming) {
				if (!mounted.current || operation !== generation.current) break;

				if (!isSupportedFile(file, mode)) {
					notify(
						mode === 'resize'
							? 'resizeUnsupported'
							: mode === 'compression'
								? 'compressionUnsupported'
								: 'unsupported'
					);
					continue;
				}

				if (rows.current.length >= IMAGES.MAX_FILES) {
					limited = true;
					break;
				}

				if (total + file.size > IMAGES.MAX_TOTAL_BYTES) {
					limited = true;
					continue;
				}

				const fileBackground =
					mode === 'background' ? { background: normalizeBackgroundSettings(IMAGES.BACKGROUND.DEFAULT) } : {};

				if (file.size > IMAGES.MAX_BYTES) {
					update([
						...rows.current,
						{ id: crypto.randomUUID(), file, ...fileBackground, status: 'error', error: 'size' },
					]);
					total += file.size;
					continue;
				}

				const id = crypto.randomUUID();
				total += file.size;
				update([...rows.current, { id, file, ...fileBackground, status: 'loading' }]);

				try {
					const info = await inspectImage(file, mode);

					if (!mounted.current || operation !== generation.current) break;

					if (mode === 'resize' && !resizeInitialized.current) {
						resizeInitialized.current = true;
						setResizeState((previous) =>
							previous.width || previous.height
								? previous
								: {
										...previous,
										width: String(
											Math.max(1, Math.round((info.width * Number(previous.percent)) / 100))
										),
										height: String(
											Math.max(1, Math.round((info.height * Number(previous.percent)) / 100))
										),
									}
						);
					}

					patch(id, {
						format: info.format,
						width: info.width,
						height: info.height,
						url: createUrl(info.preview),
						originalUrl: createUrl(info.original),
						status: 'ready',
					});
				} catch (error) {
					const code = errorCode(error, 'decode');
					patch(id, {
						status: 'error',
						error:
							code === 'unsupported' && mode !== 'converter'
								? mode === 'resize'
									? 'resizeUnsupported'
									: mode === 'compression'
										? 'compressionUnsupported'
										: 'unsupported'
								: code,
					});
				}
			}
			if (limited && mounted.current) notify('limit');
		} finally {
			end(operation);
		}
	};

	const runWorker = (data: ImageWorkerRequest | BackgroundRequest): Promise<ArrayBuffer> =>
		new Promise((resolve, reject) => {
			if (!mounted.current) {
				reject(new Error('encode'));
				return;
			}

			const activeWorker =
				worker.current ??
				(data.format === 'background'
					? new Worker(new URL('../lib/images/background.worker.ts', import.meta.url), { type: 'module' })
					: new Worker(new URL('../lib/images/image.worker.ts', import.meta.url), { type: 'module' }));

			worker.current = activeWorker;
			pending.current = reject;

			activeWorker.onmessage = ({
				data: response,
			}: MessageEvent<{ buffer?: ArrayBuffer; error?: boolean | string }>) => {
				if (worker.current !== activeWorker) return;
				pending.current = null;

				if (data.format === 'background') {
					activeWorker.terminate();
					worker.current = null;
				}

				if (response.buffer) resolve(response.buffer);
				else reject(new Error(typeof response.error === 'string' ? response.error : 'encode'));
			};

			activeWorker.onerror = (event) => {
				event.preventDefault();
				if (worker.current !== activeWorker) return;
				activeWorker.terminate();
				worker.current = null;
				pending.current = null;
				reject(new Error('encode'));
			};

			activeWorker.onmessageerror = () => {
				if (worker.current !== activeWorker) return;
				activeWorker.terminate();
				worker.current = null;
				pending.current = null;
				reject(new Error('encode'));
			};

			activeWorker.postMessage(data, [data.format === 'png' ? data.buffer : data.image.data.buffer]);
		});

	const encodeAvif = (image: ImageData, quality?: number) => runWorker({ format: 'avif', image, quality });

	const optimisePng = (buffer: ArrayBuffer) => runWorker({ format: 'png', buffer });

	const isCurrent = (row: ImageFile) => row.status === 'done' && !!row.result;

	const processFiles = async () => {
		if (locked.current) return;

		const operation = begin();

		try {
			for (const row of rows.current) {
				if (!mounted.current || operation !== generation.current) break;
				if (!row.format || isCurrent(row)) continue;

				release(row.result?.url);
				release(row.result?.fullUrl);
				patch(row.id, { status: 'processing', error: undefined, result: undefined });

				try {
					const outputFormat = mode === 'background' || mode === 'converter' ? format : row.format;
					const result =
						mode === 'background'
							? await removeImageBackground(
									row.file,
									row.format,
									format as 'png' | 'webp',
									row.background ?? IMAGES.BACKGROUND.DEFAULT,
									(request) => {
										if (operation !== generation.current)
											return Promise.reject(new Error('encode'));
										return runWorker(request);
									}
								)
							: mode === 'resize'
								? await resizeImage(
										row.file,
										row.format,
										planResize(row.width!, row.height!, resize),
										encodeAvif
									)
								: mode === 'compression'
									? await compressImage(row.file, row.format, quality, encodeAvif, optimisePng)
									: await convertImage(row.file, row.format, format, encodeAvif);

					if (!mounted.current || operation !== generation.current) break;

					const base = row.file.name.replace(/\.[^.]+$/, '') || 'image';

					patch(row.id, {
						status: 'done',
						result: {
							blob: result.blob,
							width: result.width,
							height: result.height,
							url: createUrl(result.preview),
							fullUrl: createUrl(result.fullPreview),
							name: `${base}.${outputFormat}`,
							format: outputFormat,
						},
					});
				} catch (error) {
					if (!mounted.current || operation !== generation.current) break;
					patch(row.id, { status: 'error', error: errorCode(error, 'encode') });
				}
			}
		} finally {
			end(operation);
		}
	};

	const invalidateResults = () =>
		update(rows.current.map((row) => (row.result ? { ...row, status: 'ready', error: undefined } : row)));

	const setBackground = (id: string, value: BackgroundSettings) => {
		if (locked.current || mode !== 'background') return;

		const row = rows.current.find((item) => item.id === id);
		if (!row?.background) return;

		const next = normalizeBackgroundSettings(value);

		if (
			next.mode === row.background.mode &&
			next.tolerance === row.background.tolerance &&
			next.feather === row.background.feather &&
			next.sample.x === row.background.sample.x &&
			next.sample.y === row.background.sample.y
		)
			return;

		patch(id, { background: next, ...(row.format && { status: 'ready', error: undefined }) });
	};
	const setBackgroundSample = (id: string, sample: BackgroundSettings['sample']) => {
		const row = rows.current.find((item) => item.id === id);
		if (row?.background) setBackground(id, { ...row.background, sample });
	};
	const selectBackgroundFile = (id: string) => {
		if (mode === 'background' && rows.current.some((row) => row.id === id)) setActiveBackgroundId(id);
	};

	const updateResize = (next: ResizeSettings) => {
		if (locked.current) return;

		setResizeState(next);
		invalidateResults();
	};
	const setResizeSide = (side: 'width' | 'height', value: string) => {
		const next = { ...resize, [side]: value };
		const reference = rows.current.find((row) => row.width && row.height);
		const number = Number(value);

		if (resize.keepAspect && reference && Number.isSafeInteger(number) && number > 0) {
			const other = side === 'width' ? 'height' : 'width';
			next[other] = String(Math.max(1, Math.round((number * reference[other]!) / reference[side]!)));
		}

		updateResize(next);
	};
	const setResizeUnit = (unit: ResizeSettings['unit']) => {
		if (unit === resize.unit) return;

		const reference = rows.current.find((row) => row.width && row.height);
		const plan = reference && planResize(reference.width!, reference.height!, resize);

		if (!reference || !plan || plan.error) {
			updateResize({ ...resize, unit });
			return;
		}

		const scale = resize.keepAspect
			? Math.min(Number(resize.width) / reference.width!, Number(resize.height) / reference.height!)
			: Number(resize.width) / reference.width!;

		updateResize(
			unit === 'percent'
				? { ...resize, unit, percent: String(Number((scale * 100).toFixed(6))) }
				: { ...resize, unit, width: String(plan.width), height: String(plan.height), keepAspect: true }
		);
	};

	const resizePlans = new Map(
		files
			.filter((row) => row.width && row.height)
			.map((row) => [row.id, planResize(row.width!, row.height!, resize)])
	);

	const setQuality = (value: number) => {
		if (locked.current || !Number.isFinite(value)) return;

		const next = Math.min(100, Math.max(1, Math.round(value)));
		if (next === quality) return;

		setQualityState(next);
		invalidateResults();
	};

	const setFormat = (value: string) => {
		const formats: readonly string[] = mode === 'background' ? IMAGES.BACKGROUND.FORMATS : IMAGES.CONVERTER.FORMATS;

		if (!locked.current && value !== format && formats.includes(value)) {
			setFormatState(value as ImageFormat);
			update(rows.current.map((row) => (row.result ? { ...row, status: 'ready', error: undefined } : row)));
		}
	};

	const remove = (id: string) => {
		if (locked.current) return;

		const row = rows.current.find((item) => item.id === id);
		const remaining = rows.current.filter((item) => item.id !== id);

		if (mode === 'background' && activeBackgroundFile?.id === id) {
			const index = rows.current.findIndex((item) => item.id === id);
			setActiveBackgroundId(remaining[Math.min(index, remaining.length - 1)]?.id ?? null);
		}

		release(row?.url);
		release(row?.originalUrl);
		release(row?.result?.url);
		release(row?.result?.fullUrl);
		update(remaining);
	};
	const clear = () => {
		if (locked.current && mode !== 'background') return;

		generation.current++;

		urls.current.forEach((url) => URL.revokeObjectURL(url));
		urls.current.clear();

		worker.current?.terminate();
		worker.current = null;

		pending.current?.(new Error('encode'));
		pending.current = null;

		locked.current = false;

		setBusy(false);
		setActiveBackgroundId(null);
		update([]);
	};

	const ready = files.filter(isCurrent);

	const download = (row: ImageFile) => {
		if (isCurrent(row) && row.result) {
			try {
				saveAs(row.result.blob, row.result.name);
			} catch {
				notify('download');
			}
		}
	};
	const downloadZip = async () => {
		if (locked.current || ready.length < 2) return;

		const operation = begin();

		try {
			const zip = new JSZip();
			const names = new Set<string>();

			for (const row of ready) {
				const result = row.result;
				if (!result) continue;

				let name = result.name;
				let index = 2;

				while (names.has(name.toLowerCase())) {
					name = `${result.name.slice(0, -(result.format.length + 1))} (${index++}).${result.format}`;
				}

				names.add(name.toLowerCase());
				zip.file(name, result.blob);
			}

			const blob = await zip.generateAsync({ type: 'blob' });

			if (mounted.current && operation === generation.current)
				saveAs(
					blob,
					mode === 'background'
						? 'Background_removed_images.zip'
						: mode === 'resize'
							? 'Resized_images.zip'
							: mode === 'compression'
								? 'Compressed_images.zip'
								: 'Images.zip'
				);
		} catch {
			if (mounted.current && operation === generation.current) notify('download');
		} finally {
			end(operation);
		}
	};

	return {
		files,
		format,
		setFormat,
		quality,
		setQuality,
		activeBackgroundFile,
		selectBackgroundFile,
		setBackground,
		setBackgroundSample,
		resize,
		resizePlans,
		setResizeSide,
		setResizeUnit,
		setResizePercent: (value: string) => updateResize({ ...resize, percent: value }),
		setKeepAspect: (value: boolean) => updateResize({ ...resize, keepAspect: value }),
		busy,
		addFiles,
		processFiles,
		remove,
		clear,
		ready,
		download,
		downloadZip,
	};
};
