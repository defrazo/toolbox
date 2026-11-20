import { IMAGES } from '../model/constants';
import { type ImagePolicy, imagePolicy, type ImagePolicyOptions } from '../model/imagePolicy';
import type { ImageFormat, Mode } from '../model/types';
import { canvasBlob, createCanvas, thumbnailCanvas } from './canvas';
import { checkDimensions, checkOutputDimensions, type ImageLimits } from './dimensions';
import { readImageDimensions } from './headers';
import { isMemoryAllocationError } from './memory';
import type { ThumbnailMessage, ThumbnailResponse } from './thumbnail.worker';

export { canvasBlob, createCanvas } from './canvas';
export { checkDimensions } from './dimensions';

type Dimensions = { width: number; height: number };

export const detectFormat = async (file: Blob): Promise<ImageFormat> => {
	const bytes = new Uint8Array(await file.slice(0, 256).arrayBuffer());
	const ascii = (start: number, end: number) => String.fromCharCode(...bytes.slice(start, end));

	if (bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255) return 'jpg';
	if (bytes[0] === 137 && ascii(1, 4) === 'PNG') return 'png';
	if (ascii(0, 4) === 'RIFF' && ascii(8, 12) === 'WEBP') return 'webp';
	if (bytes[0] === 0 && bytes[1] === 0 && bytes[2] === 1 && bytes[3] === 0) return 'ico';

	throw new Error('unsupported');
};

export const loadImage = async (blob: Blob, signal?: AbortSignal, limits?: ImageLimits) => {
	signal?.throwIfAborted();
	const header = await readImageDimensions(blob);
	signal?.throwIfAborted();
	if (header) checkDimensions(header.width, header.height, limits);

	const url = URL.createObjectURL(blob);
	const image = new Image();
	const abort = () => (image.src = '');

	signal?.addEventListener('abort', abort, { once: true });

	try {
		image.src = url;
		await image.decode();
		signal?.throwIfAborted();

		checkDimensions(image.naturalWidth, image.naturalHeight, limits);

		return image;
	} catch (error) {
		image.src = '';
		throw error;
	} finally {
		signal?.removeEventListener('abort', abort);
		URL.revokeObjectURL(url);
	}
};

const imageBlob = async (file: Blob, format: ImageFormat) => {
	if (format !== 'ico') return file;

	const { decodeIco } = await import('icojs/browser');
	const images = await decodeIco(await file.arrayBuffer(), 'image/png');
	const largest = images.sort((a, b) => b.width * b.height - a.width * a.height)[0];

	if (!largest) throw new Error('decode');

	return new Blob([largest.buffer], { type: IMAGES.MIME.png });
};

export const decodeImage = async (file: Blob, format: ImageFormat, limits?: ImageLimits) =>
	loadImage(await imageBlob(file, format), undefined, limits);

export const decodeDrawable = async (
	blob: Blob,
	format?: ImageFormat,
	signal?: AbortSignal,
	prepared?: ImageBitmap,
	limits?: ImageLimits,
	preserveMemoryErrors = false
) => {
	signal?.throwIfAborted();

	const source = format && !prepared ? await imageBlob(blob, format) : blob;
	if (!prepared && typeof document === 'undefined') {
		const header = await readImageDimensions(source);
		if (header) checkDimensions(header.width, header.height, limits);
	}

	signal?.throwIfAborted();

	const image =
		prepared ??
		(typeof document === 'undefined'
			? await createImageBitmap(source, {
					imageOrientation: 'from-image',
					premultiplyAlpha: 'default',
					colorSpaceConversion: 'default',
				}).catch((error) => {
					if (preserveMemoryErrors && isMemoryAllocationError(error)) throw new Error('memoryAllocation');
					throw new Error('workerDecode');
				})
			: await loadImage(source, signal, limits));

	let closed = false;

	const close = () => {
		if (closed) return;

		closed = true;

		if ('close' in image) image.close();
		else image.src = '';
	};

	const width = 'naturalWidth' in image ? image.naturalWidth : image.width;
	const height = 'naturalHeight' in image ? image.naturalHeight : image.height;

	try {
		signal?.throwIfAborted();
		checkDimensions(width, height, limits);
		return { source: image, width, height, close };
	} catch (error) {
		close();
		throw error;
	}
};

const canvasThumbnail = async (
	blob: Blob,
	signal?: AbortSignal,
	limits?: ImageLimits,
	onMetadata?: (dimensions: Dimensions) => void
) => {
	signal?.throwIfAborted();

	const image = await loadImage(blob, signal, limits);

	const width = image.naturalWidth;
	const height = image.naturalHeight;

	try {
		signal?.throwIfAborted();
		onMetadata?.({ width, height });
		const preview = await thumbnailCanvas(image, width, height);
		signal?.throwIfAborted();

		return { width, height, preview };
	} finally {
		image.src = '';
	}
};

export const createThumbnailPreparation = () => {
	let worker: Worker | null = null;
	let cancel: (() => void) | undefined;

	const terminate = () => {
		worker?.terminate();
		worker = null;
	};

	return {
		prepare(blob: Blob, signal: AbortSignal, limits: ImageLimits) {
			signal.throwIfAborted();
			if (cancel) throw new Error('decode');

			const controller = new AbortController();

			let resolveMetadata!: (dimensions: Dimensions) => void;
			let rejectMetadata!: (error: unknown) => void;

			const metadata = new Promise<Dimensions>((resolve, reject) => {
				resolveMetadata = resolve;
				rejectMetadata = reject;
			});

			const thumbnail = new Promise<Dimensions & { preview: Blob }>((resolve, reject) => {
				const cleanup = () => {
					signal.removeEventListener('abort', abort);
					if (worker) worker.onmessage = worker.onerror = worker.onmessageerror = null;
					cancel = undefined;
				};

				const fail = (error: unknown) => {
					if (cancel !== abort) return;
					cleanup();
					rejectMetadata(error);
					reject(error);
				};

				const abort = () => {
					controller.abort(signal.reason);
					terminate();
					fail(controller.signal.reason);
				};

				const fallback = (error: unknown) => {
					if (cancel !== abort) return;

					terminate();
					if (controller.signal.aborted || (error instanceof Error && error.message === 'pixels')) {
						fail(error);
						return;
					}

					void canvasThumbnail(blob, controller.signal, limits, resolveMetadata).then((result) => {
						if (cancel !== abort) return;
						cleanup();
						resolve(result);
					}, fail);
				};

				cancel = abort;
				signal.addEventListener('abort', abort, { once: true });

				try {
					worker ??= new Worker(new URL('./thumbnail.worker.ts', import.meta.url), { type: 'module' });

					const activeWorker = worker;
					worker.onmessage = ({ data }: MessageEvent<ThumbnailMessage>) => {
						if (worker !== activeWorker || cancel !== abort) return;
						if ('metadata' in data) resolveMetadata(data.metadata);
						else if ('error' in data) fallback(new Error(data.error));
						else {
							resolveMetadata({ width: data.width, height: data.height });
							cleanup();
							resolve(data);
						}
					};

					worker.onerror = (event) => {
						if (worker !== activeWorker || cancel !== abort) return;
						event.preventDefault();
						fallback(new Error('decode'));
					};

					worker.onmessageerror = () => {
						if (worker === activeWorker && cancel === abort) fallback(new Error('decode'));
					};

					worker.postMessage({ blob, limits, reportMetadata: true });
				} catch (error) {
					fallback(error);
				}
			});

			void metadata.catch(() => {});
			void thumbnail.catch(() => {});
			return { metadata, thumbnail };
		},
		dispose() {
			cancel?.();
			terminate();
		},
	};
};

export const thumbnail = async (blob: Blob, signal?: AbortSignal, limits?: ImageLimits) => {
	signal?.throwIfAborted();

	if (typeof document === 'undefined') {
		const image = await decodeDrawable(blob, undefined, signal, undefined, limits);

		try {
			return {
				width: image.width,
				height: image.height,
				preview: await thumbnailCanvas(image.source, image.width, image.height),
			};
		} finally {
			image.close();
		}
	}

	try {
		return await new Promise<{ width: number; height: number; preview: Blob }>((resolve, reject) => {
			const worker = new Worker(new URL('./thumbnail.worker.ts', import.meta.url), { type: 'module' });

			const cleanup = () => {
				signal?.removeEventListener('abort', abort);
				worker.terminate();
			};

			const abort = () => {
				cleanup();
				reject(signal?.reason);
			};

			signal?.addEventListener('abort', abort, { once: true });

			worker.onmessage = ({ data }: MessageEvent<ThumbnailResponse>) => {
				cleanup();
				if ('error' in data) reject(new Error(data.error));
				else resolve(data);
			};

			worker.onerror = (event) => {
				event.preventDefault();
				cleanup();
				reject(new Error('decode'));
			};

			worker.onmessageerror = () => {
				cleanup();
				reject(new Error('decode'));
			};

			try {
				worker.postMessage(limits ? { blob, limits } : blob);
			} catch (error) {
				cleanup();
				reject(error);
			}
		});
	} catch (error) {
		signal?.throwIfAborted();

		if (error instanceof Error && error.message === 'pixels') throw error;
		return canvasThumbnail(blob, signal, limits);
	}
};

export const inspectImage = async (
	file: File,
	mode: Mode = 'converter',
	signal?: AbortSignal,
	limits?: ImageLimits,
	options?: Omit<ImagePolicyOptions, 'mode' | 'format'>
) => {
	signal?.throwIfAborted();

	if (file.size > IMAGES.MAX_BYTES) throw new Error('size');

	const format = await detectFormat(file);
	signal?.throwIfAborted();

	if (mode === 'compression' && format === 'ico') throw new Error('compressionUnsupported');
	if (mode === 'resize' && format === 'ico') throw new Error('resizeUnsupported');

	const original = await imageBlob(file, format);
	const effectiveLimits = limits ?? imagePolicy({ ...options, mode, format }).input;
	const header = await readImageDimensions(original);

	signal?.throwIfAborted();
	if (header) checkDimensions(header.width, header.height, effectiveLimits);

	return { ...(await thumbnail(original, signal, effectiveLimits)), format, original };
};

export const inspectImageMetadata = async (
	file: File,
	mode: Mode,
	signal: AbortSignal,
	limitsFor: (format: ImageFormat) => ImageLimits,
	beforeDecode?: (width: number, height: number) => void,
	decodeMetadata?: (blob: Blob, limits: ImageLimits) => Promise<Dimensions>
) => {
	signal.throwIfAborted();
	const format = await detectFormat(file);
	signal.throwIfAborted();

	if (mode === 'compression' && format === 'ico') throw new Error('compressionUnsupported');
	if (mode === 'resize' && format === 'ico') throw new Error('resizeUnsupported');

	const limits = limitsFor(format);
	const original = await imageBlob(file, format);

	signal.throwIfAborted();
	const header = await readImageDimensions(original);
	signal.throwIfAborted();

	if (header) checkDimensions(header.width, header.height, limits);
	if (header) beforeDecode?.(header.width, header.height);
	if (header && format !== 'jpg') return { format, original, ...header };

	if (decodeMetadata) {
		const decoded = await decodeMetadata(original, limits);

		signal.throwIfAborted();
		checkDimensions(decoded.width, decoded.height, limits);

		return { format, original, ...decoded };
	}

	const decoded = await decodeDrawable(original, undefined, signal, undefined, limits, true);

	try {
		return { format, original, width: decoded.width, height: decoded.height };
	} finally {
		decoded.close();
	}
};

export const verifyImageOutput = async (
	blob: Blob,
	format: ImageFormat,
	width: number,
	height: number,
	limits: ImageLimits,
	signal?: AbortSignal,
	decodedSize?: Dimensions
) => {
	checkOutputDimensions(width, height, limits, format);
	if ((await detectFormat(blob)) !== format) throw new Error('encode');
	if (format === 'ico') return;

	const header = decodedSize ?? (await readImageDimensions(blob));
	if (header) {
		if (header.width !== width || header.height !== height) throw new Error('outputDimensions');
		return;
	}

	const decoded = await decodeDrawable(blob, undefined, signal, undefined, limits);
	try {
		if (decoded.width !== width || decoded.height !== height) throw new Error('outputDimensions');
	} finally {
		decoded.close();
	}
};

export const convertImage = async (
	file: File,
	sourceFormat: ImageFormat,
	format: ImageFormat,
	quality = 0.9,
	dimensions?: Dimensions,
	signal?: AbortSignal,
	prepared?: ImageBitmap,
	policy: ImagePolicy = imagePolicy({ mode: 'converter', format: sourceFormat, output: format })
) => {
	signal?.throwIfAborted();
	if (dimensions) checkOutputDimensions(dimensions.width, dimensions.height, policy.output, format);
	if (prepared) {
		const header = await readImageDimensions(file);
		if (header) checkDimensions(header.width, header.height, policy.input);
	}

	const image = await decodeDrawable(
		file,
		sourceFormat,
		signal,
		prepared,
		prepared ? policy.output : policy.input,
		true
	);

	let surface: ReturnType<typeof createCanvas> | undefined;

	try {
		if (format !== 'ico')
			checkOutputDimensions(
				dimensions?.width ?? image.width,
				dimensions?.height ?? image.height,
				policy.output,
				format
			);

		surface = createCanvas(dimensions?.width ?? image.width, dimensions?.height ?? image.height);

		const { canvas, context } = surface;
		if (format === 'jpg') {
			context.fillStyle = '#ffffff';
			context.fillRect(0, 0, canvas.width, canvas.height);
		}

		context.drawImage(image.source, 0, 0, canvas.width, canvas.height);
		image.close();

		let blob: Blob;
		let preview: Blob;

		if (format === 'ico') {
			const { encodeIco } = await import('icojs/browser');
			const icons: { buffer: ArrayBuffer; usePngIcon: boolean }[] = [];
			let largest: Blob | undefined;

			for (const size of [16, 32, 48]) {
				signal?.throwIfAborted();
				const icon = createCanvas(size, size);

				try {
					const scale = Math.min(size / canvas.width, size / canvas.height);
					const width = Math.max(1, Math.round(canvas.width * scale));
					const height = Math.max(1, Math.round(canvas.height * scale));

					icon.context.drawImage(
						canvas,
						Math.floor((size - width) / 2),
						Math.floor((size - height) / 2),
						width,
						height
					);

					largest = await canvasBlob(icon.canvas, IMAGES.MIME.png);
					icons.push({ buffer: await largest.arrayBuffer(), usePngIcon: true });
				} finally {
					icon.canvas.width = icon.canvas.height = 0;
				}
			}

			if (!largest) throw new Error('encode');

			blob = new Blob([await encodeIco(icons)], { type: IMAGES.MIME.ico });
			preview = largest;
		} else {
			blob = await canvasBlob(canvas, IMAGES.MIME[format], quality);
			preview = blob;
		}

		await verifyImageOutput(
			blob,
			format,
			format === 'ico' ? 48 : canvas.width,
			format === 'ico' ? 48 : canvas.height,
			policy.output,
			signal
		);
		signal?.throwIfAborted();

		return {
			blob,
			preview,
			fullPreview: preview,
			width: format === 'ico' ? 48 : canvas.width,
			height: format === 'ico' ? 48 : canvas.height,
		};
	} finally {
		image.close();
		if (surface) surface.canvas.width = surface.canvas.height = 0;
	}
};
