import { useEffect, useRef, useState } from 'react';
import { saveAs } from 'file-saver';

import { generateUUID } from '@/shared/lib/utils';

import type { ArchiveEntry } from '../lib/archive';
import { createArchive } from '../lib/archiveClient';
import { createThumbnailPreparation, inspectImageMetadata, thumbnail } from '../lib/converter';
import { checkDimensions, checkOutputDimensions, type ImageLimits } from '../lib/dimensions';
import {
	admitImageJob,
	BATCH_PROCESSING,
	canShareImageBudget,
	isMemoryAllocationError,
	retainedImageBytes,
} from '../lib/memory';
import type { ImageJob } from '../lib/processImage';
import { createImageProcessor, estimateImageJobBytes } from '../lib/processor';
import { planResize } from '../lib/resize';
import { IMAGES } from './constants';
import { imageDevice, imageMemoryBudget, imagePolicy } from './imagePolicy';
import type { ImageError, ImageFile, ImageFormat, Mode, ResizeSettings } from './types';

const IMAGE_ERRORS: ImageError[] = [
	'unsupported',
	'compressionUnsupported',
	'resizeUnsupported',
	'resizeSettings',
	'size',
	'pixels',
	'outputPixels',
	'outputDimensions',
	'webpSide',
	'memory',
	'batchResolution',
	'timeout',
	'decode',
	'encode',
];

const errorCode = (error: unknown, fallback: ImageError): ImageError => {
	const code = error instanceof Error ? error.message : '';
	return IMAGE_ERRORS.includes(code as ImageError) ? (code as ImageError) : fallback;
};

const isSupportedFile = (file: File, mode: Mode) => {
	const accept = mode === 'converter' ? IMAGES.CONVERTER.ACCEPT : IMAGES.COMPRESSION.ACCEPT;
	const extension = `.${file.name.split('.').pop()?.toLowerCase()}`;

	return accept.split(',').includes(extension);
};

export const useImages = (
	notify: (error: ImageError | 'limit' | 'download', limits?: ImageLimits) => void,
	mode: Mode = 'converter'
) => {
	const [files, setFiles] = useState<ImageFile[]>([]);
	const [format, setFormatState] = useState<ImageFormat>('png');
	const [quality, setQualityState] = useState(80);
	const [resize, setResizeState] = useState<ResizeSettings>(IMAGES.RESIZE.DEFAULT);
	const [zipProgress, setZipProgress] = useState<number | null>(null);
	const [busy, setBusy] = useState(false);
	const [isProcessing, setIsProcessing] = useState(false);
	const [progress, setProgress] = useState<{ completed: number; total: number } | null>(null);
	const [preparationProgress, setPreparationProgress] = useState<{ completed: number; total: number } | null>(null);

	const batchMode = () => ['converter', 'compression', 'resize'].includes(mode);
	const additions = useRef<{ ids: string[]; completed: Set<string> }[]>([]);
	const preparationTask = useRef<Promise<void> | null>(null);
	const preparingFile = useRef<string | null>(null);
	const attemptedThumbnails = useRef(new Set<string>());
	const formatRef = useRef(format);
	formatRef.current = format;
	const resizeRef = useRef(resize);
	resizeRef.current = resize;
	const resizeOwner = useRef<{ id: string; previous: ResizeSettings } | null>(null);
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
	const limitsFor = (sourceFormat?: ImageFormat, count = rows.current.length) =>
		imagePolicy({
			mode,
			format: sourceFormat,
			output: mode === 'converter' ? formatRef.current : sourceFormat,
			batch: count > 1,
		});
	const policy = limitsFor(files.length === 1 ? files[0].format : undefined, files.length);

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
		if (!url || !urls.current.has(url)) return;

		URL.revokeObjectURL(url);
		urls.current.delete(url);
	};
	const releaseFile = (row: ImageFile) => {
		release(row.url);
		release(row.originalUrl);
		release(row.result?.url);
		release(row.result?.fullUrl);
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
		if (batchMode()) prepareBatch();
	};

	const preparationStatus = () => {
		additions.current = additions.current.filter((batch) =>
			batch.ids.some((id) => rows.current.some((row) => row.id === id) && !batch.completed.has(id))
		);
		const ids = additions.current.flatMap((batch) =>
			batch.ids.filter((id) => rows.current.some((row) => row.id === id))
		);
		const completed = additions.current.reduce(
			(sum, batch) => sum + batch.ids.filter((id) => ids.includes(id) && batch.completed.has(id)).length,
			0
		);
		if (mounted.current) setPreparationProgress(ids.length ? { total: ids.length, completed } : null);
	};
	const initialiseResize = (width: number, height: number, id: string) => {
		const resize = resizeRef.current;
		if (mode !== 'resize' || resizeInitialized.current) return resize;

		resizeOwner.current = { id, previous: resize };
		resizeInitialized.current = true;

		const next =
			resize.width || resize.height
				? resize
				: {
						...resize,
						width: String(Math.max(1, Math.round((width * Number(resize.percent)) / 100))),
						height: String(Math.max(1, Math.round((height * Number(resize.percent)) / 100))),
					};

		resizeRef.current = next;
		setResizeState(next);

		return next;
	};
	const admitSourceDecode = (width: number, height: number) => {
		admitImageJob(width * height * 8 + 32 * 1024 * 1024, retainedImageBytes(rows.current));
	};
	const prepareBatch = () => {
		if (!batchMode() || locked.current || preparationTask.current || !mounted.current) return;

		const controller = new AbortController();
		preparation.current = controller;

		const thumbnails = createThumbnailPreparation();

		const current = (id: string) =>
			mounted.current && !controller.signal.aborted && rows.current.some((row) => row.id === id);

		preparationTask.current = Promise.resolve()
			.then(async () => {
				for (const batch of additions.current)
					for (const id of batch.ids) {
						if (controller.signal.aborted || locked.current || !mounted.current) return;

						const row = rows.current.find((item) => item.id === id);
						if (!row || attemptedThumbnails.current.has(id)) {
							batch.completed.add(id);
							continue;
						}

						let inputLimits = limitsFor(row.format).input;
						let preview: ReturnType<typeof thumbnails.prepare>['thumbnail'] | undefined;

						preparingFile.current = id;

						try {
							const info =
								row.format && row.width && row.height && row.format !== 'ico'
									? { format: row.format, width: row.width, height: row.height, original: row.file }
									: await inspectImageMetadata(
											row.file,
											mode,
											controller.signal,
											(format) => {
												inputLimits = limitsFor(format).input;
												return inputLimits;
											},
											admitSourceDecode,
											(blob, limits) => {
												const task = thumbnails.prepare(blob, controller.signal, limits);
												preview = task.thumbnail;
												return task.metadata;
											}
										);

							if (!current(id)) continue;

							initialiseResize(info.width, info.height, row.id);

							patch(id, {
								format: info.format,
								width: info.width,
								height: info.height,
								...(row.status === 'loading' && { status: 'ready' }),
							});

							try {
								admitSourceDecode(info.width, info.height);

								const image = await (preview ??
									(info.format === 'ico'
										? thumbnail(info.original, controller.signal, limitsFor(info.format).input)
										: thumbnails.prepare(
												info.original,
												controller.signal,
												limitsFor(info.format).input
											).thumbnail));

								if (!current(id)) continue;

								patch(id, { url: createUrl(image.preview) });
							} catch {
								thumbnails.dispose();
								if (controller.signal.aborted) return;
							}
						} catch (error) {
							thumbnails.dispose();
							if (!current(id)) continue;

							patch(id, { status: 'error', error: errorCode(error, 'decode'), errorLimits: inputLimits });
						} finally {
							if (preparingFile.current === id) preparingFile.current = null;
						}

						if (current(id)) {
							attemptedThumbnails.current.add(id);
							batch.completed.add(id);
							preparationStatus();
						}
					}
			})
			.finally(() => {
				thumbnails.dispose();

				if (preparation.current === controller) preparation.current = null;
				preparationTask.current = null;

				if (mounted.current && !locked.current) {
					preparationStatus();
					if (additions.current.length) prepareBatch();
				}
			});
	};

	const addBatch = (incoming: File[]) => {
		const added: ImageFile[] = [];

		let total = rows.current.reduce((sum, row) => sum + row.file.size, 0);

		for (const file of incoming) {
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
				notify('limit');
				break;
			}

			if (file.size > IMAGES.MAX_BYTES) {
				notify('size');
				continue;
			}

			if (total + file.size > IMAGES.MAX_TOTAL_BYTES) {
				notify('limit');
				continue;
			}

			total += file.size;
			added.push({ id: generateUUID(), file, status: 'loading' });
		}

		if (!added.length) return;

		update([...rows.current, ...added]);
		additions.current.push({ ids: added.map((row) => row.id), completed: new Set() });
		preparationStatus();
		prepareBatch();
	};
	const cancelBatchAddition = () => {
		if (!additions.current.length || locked.current) return;

		const pending = new Set(additions.current.flatMap((batch) => batch.ids));
		const completed = new Set(additions.current.flatMap((batch) => [...batch.completed]));
		const cancelled = new Set(
			rows.current
				.filter(
					(row) => pending.has(row.id) && !completed.has(row.id) && !(row.format && row.width && row.height)
				)
				.map((row) => row.id)
		);

		preparation.current?.abort();

		if (resizeOwner.current && cancelled.has(resizeOwner.current.id)) {
			resizeRef.current = resizeOwner.current.previous;
			setResizeState(resizeOwner.current.previous);
			resizeInitialized.current = false;
			resizeOwner.current = null;
		}

		additions.current = [];

		update(
			rows.current.filter((row) => {
				if (!cancelled.has(row.id)) return true;
				releaseFile(row);
				attemptedThumbnails.current.delete(row.id);
				return false;
			})
		);

		preparationStatus();
	};

	const processBatch = async () => {
		if (locked.current) return;

		const operation = begin(),
			controller = new AbortController();
		processing.current = controller;
		setIsProcessing(true);
		preparation.current?.abort();

		const queue = rows.current.filter((row) => !isCurrent(row) && row.status !== 'error');
		if (queue.length) archiveCache.current = null;

		setProgress({ completed: 0, total: queue.length });

		const queuedIds = new Set(queue.map((row) => row.id));
		update(rows.current.map((row) => (queuedIds.has(row.id) ? { ...row, status: 'ready' } : row)));

		const current = () => mounted.current && operation === generation.current && !controller.signal.aborted;

		let effectiveResize = resize;

		const budget = imageMemoryBudget();
		const limit = imageDevice() === 'desktop' && BATCH_PROCESSING.maxActive >= 2 ? 2 : 1;
		const active = new Map<Promise<void>, { bytes: number; parallel: boolean }>();

		const fail = (id: string, error: unknown, policy: ReturnType<typeof limitsFor>) => {
			if (!current()) return;

			const system = isMemoryAllocationError(error);
			const code = system ? 'memory' : errorCode(error, 'encode');

			patch(id, {
				status: 'error',
				error: code,
				errorLimits: code === 'outputPixels' || code === 'webpSide' ? policy.output : policy.input,
			});

			setProgress((value) => value && { ...value, completed: value.completed + 1 });
			if (system) controller.abort();
		};
		try {
			await preparationTask.current;
			for (const entry of queue) {
				if (!current()) break;

				while (current() && active.size >= limit) await Promise.race(active.keys());
				if (!current()) break;

				const row = rows.current.find((item) => item.id === entry.id);
				if (!row) continue;
				if ((!row.format || !row.width || !row.height) && active.size) await Promise.all(active.keys());
				if (!current()) break;

				let processor: ReturnType<typeof createImageProcessor> | undefined;
				let policy = limitsFor(row.format);

				try {
					const info =
						row.format && row.width && row.height
							? { format: row.format, width: row.width, height: row.height, original: row.file }
							: await inspectImageMetadata(
									row.file,
									mode,
									controller.signal,
									(format) => {
										policy = limitsFor(format);
										return policy.input;
									},
									admitSourceDecode
								);

					if (!current()) break;

					policy = limitsFor(info.format);
					checkDimensions(info.width, info.height, policy.input);

					if (!resizeInitialized.current) effectiveResize = initialiseResize(info.width, info.height, row.id);

					patch(row.id, { format: info.format, width: info.width, height: info.height });

					const common = { id: operation + ':' + row.id, file: row.file, format: info.format, policy };
					const job: ImageJob =
						mode === 'resize'
							? {
									...common,
									mode,
									plan: planResize(
										info.width,
										info.height,
										effectiveResize,
										policy.output,
										info.format
									),
								}
							: mode === 'compression'
								? { ...common, mode, quality }
								: { ...common, mode: 'converter', output: format };

					if (job.mode === 'resize') {
						if (job.plan.error) throw new Error(job.plan.error);
						checkOutputDimensions(job.plan.width, job.plan.height, policy.output, job.format);
					} else {
						const output = 'output' in job ? job.output : job.format;
						if (output !== 'ico') checkOutputDimensions(info.width, info.height, policy.output, output);
					}

					const bytes = estimateImageJobBytes(job, info.width, info.height);
					const parallel = canShareImageBudget(job, bytes, budget);

					const fitsAlongside = () =>
						parallel &&
						[...active.values()].every((value) => value.parallel) &&
						[...active.values()].reduce((sum, value) => sum + value.bytes, bytes) +
							retainedImageBytes(rows.current) +
							BATCH_PROCESSING.parallelReserve <=
							budget;

					while (current() && active.size && !fitsAlongside()) await Promise.race(active.keys());
					if (!current()) break;

					const reserved = [...active.values()].reduce((sum, value) => sum + value.bytes, bytes);
					admitImageJob(
						reserved + (active.size ? BATCH_PROCESSING.parallelReserve : 0),
						retainedImageBytes(rows.current),
						budget
					);

					processor = createImageProcessor(controller.signal);
					const runningProcessor = processor;

					patch(row.id, { status: 'processing', error: undefined, errorLimits: undefined });

					let task: Promise<void>;
					task = Promise.resolve().then(async () => {
						try {
							if (!current()) return;
							const result = await runningProcessor.process(job);
							if (!current()) return;

							const output = job.mode === 'converter' ? job.output : job.format;
							patch(row.id, {
								status: 'done',
								result: {
									blob: result.blob,
									width: result.width,
									height: result.height,
									name: (row.file.name.replace(/\.[^.]+$/, '') || 'image') + '.' + output,
									format: output,
								},
							});

							setProgress((value) => value && { ...value, completed: value.completed + 1 });
						} catch (error) {
							fail(row.id, error, policy);
						} finally {
							runningProcessor.dispose();
							active.delete(task);
						}
					});

					active.set(task, { bytes, parallel });
					processor = undefined;
				} catch (error) {
					fail(row.id, error, policy);
				} finally {
					processor?.dispose();
				}
			}
		} finally {
			await Promise.all(active.keys());

			if (controller.signal.aborted && mounted.current)
				update(rows.current.map((row) => (row.status === 'processing' ? { ...row, status: 'ready' } : row)));

			if (processing.current === controller) {
				processing.current = null;
				if (mounted.current) setIsProcessing(false);
			}

			end(operation);
			prepareBatch();
		}
	};

	const addFiles = async (incoming: File[]) => {
		if (!incoming.length || locked.current) return;
		return addBatch(incoming);
	};

	const isCurrent = (row: ImageFile) => row.status === 'done' && !!row.result;

	const processFiles = processBatch;

	const cancelProcessing = () => {
		const controller = processing.current;
		if (!controller) return;
		controller.abort();
		update(rows.current.map((row) => (row.status === 'processing' ? { ...row, status: 'ready' } : row)));
	};

	const invalidateResults = () =>
		update(
			rows.current.map((row) => {
				release(row.result?.url);
				release(row.result?.fullUrl);
				return { ...row, result: undefined, status: 'ready', error: undefined, errorLimits: undefined };
			})
		);

	const updateResize = (next: ResizeSettings) => {
		if (locked.current) return;

		resizeOwner.current = null;
		resizeRef.current = next;
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
		const plan =
			reference &&
			planResize(
				reference.width!,
				reference.height!,
				resize,
				limitsFor(reference.format).output,
				reference.format
			);

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
			.map((row) => [
				row.id,
				planResize(row.width!, row.height!, resize, limitsFor(row.format).output, row.format),
			])
	);

	const setQuality = (value: number) => {
		if (locked.current || !Number.isFinite(value)) return;

		const next = Math.min(100, Math.max(1, Math.round(value)));
		if (next === quality) return;

		setQualityState(next);
		invalidateResults();
	};

	const setFormat = (value: string) => {
		if (!locked.current && value !== format && IMAGES.CONVERTER.FORMATS.includes(value as ImageFormat)) {
			formatRef.current = value as ImageFormat;
			preparation.current?.abort();
			setFormatState(value as ImageFormat);
			invalidateResults();
		}
	};

	const remove = (id: string) => {
		if (locked.current) return;
		if (batchMode() && preparingFile.current === id) preparation.current?.abort();

		const row = rows.current.find((item) => item.id === id);
		const remaining = rows.current.filter((item) => item.id !== id);

		release(row?.url);
		release(row?.originalUrl);
		release(row?.result?.url);
		release(row?.result?.fullUrl);
		attemptedThumbnails.current.delete(id);
		update(remaining);
		if (batchMode()) preparationStatus();
	};
	const clear = () => {
		if (locked.current) return;

		generation.current++;

		archive.current?.abort();
		archive.current = null;
		archiveCache.current = null;

		setZipProgress(null);

		additions.current = [];
		attemptedThumbnails.current.clear();
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
		setPreparationProgress(null);
		update([]);
	};

	const ready = files.filter(isCurrent);

	const download = (row: ImageFile) => {
		const current = row;
		if (current && isCurrent(current) && current.result) {
			try {
				saveAs(current.result.blob, current.result.name);
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

			if (mounted.current && operation === generation.current) {
				const now = new Date();
				const formatter = new Intl.DateTimeFormat('ru-RU', {
					year: 'numeric',
					month: '2-digit',
					day: '2-digit',
					hour: '2-digit',
					minute: '2-digit',
					second: '2-digit',
					hour12: false,
				});

				const formattedDate = formatter
					.format(now)
					.replace(/(\d{2})\.(\d{2})\.(\d{4}),/, '$3-$2-$1')
					.replace(/:/g, '-')
					.replace(/, /, '_');

				saveAs(
					blob,
					mode === 'resize'
						? `Resized_${formattedDate}.zip`
						: mode === 'compression'
							? `Compressed_${formattedDate}.zip`
							: `Converted_${formattedDate}.zip`
				);
			}
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
		policy,
		limitsFor,
		format,
		setFormat,
		quality,
		setQuality,
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
		preparationProgress,
		cancelProcessing,
		cancelPreparation: () => {
			if (batchMode()) cancelBatchAddition();
		},
		addFiles,
		processFiles,
		remove,
		clear,
		ready,
		download,
		downloadZip,
	};
};
