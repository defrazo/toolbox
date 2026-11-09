import { useEffect, useRef, useState } from 'react';
import { saveAs } from 'file-saver';

import { inspectImage, normalizeBackgroundSettings, planResize } from '../lib';
import type { ArchiveEntry } from '../lib/images/archive';
import { createArchive } from '../lib/images/archiveClient';
import type { ImageJob } from '../lib/images/processImage';
import { createImageProcessor, estimateImageJobBytes } from '../lib/images/processor';
import { IMAGES } from './constants';
import type { BackgroundSettings, ImageError, ImageFile, ImageFormat, Mode, ResizeSettings } from './types';

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
	const [zipProgress, setZipProgress] = useState<number | null>(null);
	const [busy, setBusy] = useState(false);
	const [isProcessing, setIsProcessing] = useState(false);
	const [progress, setProgress] = useState<{ completed: number; total: number } | null>(null);

	const resizeInitialized = useRef(false);
	const rows = useRef<ImageFile[]>([]);
	const locked = useRef(false);
	const mounted = useRef(true);
	const generation = useRef(0);
	const urls = useRef(new Set<string>());
	const processing = useRef<AbortController | null>(null);
	const preparation = useRef<AbortController | null>(null);
	const archive = useRef<AbortController | null>(null);
	const archiveCache = useRef<{ entries: ArchiveEntry[]; blob: Blob } | null>(null);
	const activeBackgroundFile =
		mode === 'background' ? (files.find((row) => row.id === activeBackgroundId) ?? files[0]) : undefined;

	useEffect(() => {
		mounted.current = true;
		const ownedUrls = urls.current;

		return () => {
			mounted.current = false;
			archive.current?.abort();
			archive.current = null;
			archiveCache.current = null;
			generation.current++;
			preparation.current?.abort();
			preparation.current = null;
			processing.current?.abort();
			processing.current = null;
			ownedUrls.forEach((url) => URL.revokeObjectURL(url));
			ownedUrls.clear();
		};
	}, []);

	const update = (next: ImageFile[]) => {
		if (!mounted.current) return;

		const cached = archiveCache.current;
		if (cached) {
			const results = next.filter((row) => row.status === 'done' && row.result).map((row) => row.result!);
			if (
				results.length !== cached.entries.length ||
				results.some((result, index) => result.blob !== cached.entries[index].blob)
			)
				archiveCache.current = null;
		}
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

		setProgress(null);
		const operation = begin();
		const controller = new AbortController();
		preparation.current = controller;
		const added: ImageFile[] = [];

		let total = rows.current.reduce((sum, row) => sum + row.file.size, 0);
		let limited = false;
		let oversized = false;

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

				if (rows.current.length + added.length >= IMAGES.MAX_FILES) {
					limited = true;
					break;
				}

				if (file.size > IMAGES.MAX_BYTES) {
					oversized = true;
					continue;
				}

				if (total + file.size > IMAGES.MAX_TOTAL_BYTES) {
					limited = true;
					continue;
				}

				const fileBackground =
					mode === 'background' ? { background: normalizeBackgroundSettings(IMAGES.BACKGROUND.DEFAULT) } : {};

				total += file.size;
				added.push({ id: crypto.randomUUID(), file, ...fileBackground, status: 'loading' });
			}

			update([...rows.current, ...added]);

			for (const { id, file, status } of added) {
				if (!mounted.current || operation !== generation.current) break;
				if (status !== 'loading') continue;

				try {
					const info = await inspectImage(file, mode, controller.signal);

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
					if (!mounted.current || operation !== generation.current) break;

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
			if (mounted.current && operation === generation.current) {
				if (oversized) notify('size');
				if (limited) notify('limit');
			}
		} finally {
			if (preparation.current === controller) preparation.current = null;
			end(operation);
		}
	};

	const isCurrent = (row: ImageFile) => row.status === 'done' && !!row.result;

	const processFiles = async () => {
		if (locked.current) return;

		const operation = begin();
		const controller = new AbortController();

		processing.current = controller;

		const queue = rows.current
			.filter((row) => row.format && !isCurrent(row))
			.map((row) => {
				const common = { id: operation + ':' + row.id, file: row.file, format: row.format! };
				const job: ImageJob =
					mode === 'background'
						? {
								...common,
								mode,
								output: format as 'png' | 'webp',
								settings: row.background ?? IMAGES.BACKGROUND.DEFAULT,
							}
						: mode === 'resize'
							? { ...common, mode, plan: planResize(row.width!, row.height!, resize) }
							: mode === 'compression'
								? { ...common, mode, quality }
								: { ...common, mode: 'converter', output: format };
				return { row, job, bytes: estimateImageJobBytes(job, row.width!, row.height!) };
			});

		setIsProcessing(true);
		setProgress({ completed: 0, total: queue.length });

		const queuedIds = new Set(queue.map(({ row }) => row.id));

		update(
			rows.current.map((row) => (queuedIds.has(row.id) ? { ...row, status: 'ready', error: undefined } : row))
		);

		const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
		const budget = (memory ? (memory <= 4 ? 192 : 384) : 256) * 1024 * 1024;
		const threadedCodec =
			globalThis.crossOriginIsolated &&
			queue.some(({ job }) =>
				job.mode === 'converter'
					? job.output === 'avif'
					: job.mode === 'compression'
						? job.format === 'png' || job.format === 'avif'
						: job.mode === 'resize' && job.format === 'avif'
			);
		const largeImages = queue.some(({ bytes }) => bytes > budget / 2);
		const limit = navigator.hardwareConcurrency <= 2 || threadedCodec || largeImages ? 1 : 2;
		const processors = Array.from({ length: Math.min(limit, queue.length) }, () =>
			createImageProcessor(controller.signal)
		);
		const available = [...processors];
		const active = new Set<Promise<void>>();

		let reserved = 0;

		const current = () => mounted.current && operation === generation.current && !controller.signal.aborted;

		const processJob = async ({ row, job }: (typeof queue)[number], processor: (typeof processors)[number]) => {
			if (!current()) return;

			release(row.result?.url);
			release(row.result?.fullUrl);
			patch(row.id, { status: 'processing', error: undefined, result: undefined });

			try {
				const result = await processor.process(job);
				if (!current()) return;

				const outputFormat = job.mode === 'converter' || job.mode === 'background' ? job.output : row.format!;
				const base = row.file.name.replace(/\.[^.]+$/, '') || 'image';

				patch(row.id, {
					status: 'done',
					result: {
						blob: result.blob,
						width: result.width,
						height: result.height,
						url: createUrl(result.preview),
						fullUrl: createUrl(result.fullPreview),
						name: base + '.' + outputFormat,
						format: outputFormat,
					},
				});
			} catch (error) {
				if (current()) patch(row.id, { status: 'error', error: errorCode(error, 'encode') });
			} finally {
				if (current())
					setProgress((previous) => previous && { ...previous, completed: previous.completed + 1 });
			}
		};

		try {
			while (current() && (queue.length > 0 || active.size > 0)) {
				const retained = rows.current.reduce(
					(sum, row) => sum + row.file.size + (row.result?.blob.size ?? 0),
					0
				);
				const room = Math.max(0, budget - retained);
				const index = queue.findIndex(({ bytes }) => active.size === 0 || reserved + bytes <= room);
				if (available.length > 0 && index >= 0) {
					const [entry] = queue.splice(index, 1);
					const processor = available.pop()!;
					reserved += entry.bytes;
					const task = processJob(entry, processor).finally(() => {
						reserved -= entry.bytes;
						available.push(processor);
						active.delete(task);
					});
					active.add(task);
				} else {
					await Promise.race(active);
				}
			}

			await Promise.all(active);
		} finally {
			processors.forEach((processor) => processor.dispose());

			if (processing.current === controller) {
				processing.current = null;
				if (mounted.current) setIsProcessing(false);
			}

			end(operation);
		}
	};

	const cancelProcessing = () => {
		const controller = processing.current;
		if (!controller) return;

		generation.current++;
		processing.current = null;
		controller.abort();

		update(rows.current.map((row) => (row.status === 'processing' ? { ...row, status: 'ready' } : row)));

		locked.current = false;

		setBusy(false);
		setIsProcessing(false);
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

		archive.current?.abort();
		archive.current = null;
		archiveCache.current = null;

		setZipProgress(null);

		preparation.current?.abort();
		preparation.current = null;

		urls.current.forEach((url) => URL.revokeObjectURL(url));
		urls.current.clear();

		processing.current?.abort();
		processing.current = null;

		locked.current = false;

		setBusy(false);
		setIsProcessing(false);
		setProgress(null);
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
		const ready = rows.current.filter(isCurrent);
		if (locked.current || ready.length < 2) return;

		const operation = begin();
		const controller = new AbortController();
		archive.current = controller;

		setZipProgress(0);

		try {
			const entries: ArchiveEntry[] = [];
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
				entries.push({ name, blob: result.blob });
			}

			const cached = archiveCache.current;
			const blob =
				cached?.blob ??
				(await createArchive(entries, controller.signal, (percent) => {
					if (mounted.current && operation === generation.current) setZipProgress(percent);
				}));

			if (!mounted.current || operation !== generation.current || controller.signal.aborted) return;
			archiveCache.current = { entries, blob };

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
			if (archive.current === controller) {
				archive.current = null;
				if (mounted.current) setZipProgress(null);
			}
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
		zipProgress,
		isProcessing,
		progress,
		cancelProcessing,
		addFiles,
		processFiles,
		remove,
		clear,
		ready,
		download,
		downloadZip,
	};
};
