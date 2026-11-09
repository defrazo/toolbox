import { IMAGES } from '../../model/constants';
import type { ImageFormat, Mode } from '../../model/types';
import { canvasBlob, createCanvas, thumbnailCanvas } from './canvas';
import { checkDimensions } from './dimensions';
import type { ThumbnailResponse } from './thumbnail.worker';

export { canvasBlob, createCanvas } from './canvas';
export { checkDimensions } from './dimensions';

type Dimensions = { width: number; height: number };
type AvifEncoder = (data: ImageData) => Promise<ArrayBuffer>;

export const detectFormat = async (file: Blob): Promise<ImageFormat> => {
	const bytes = new Uint8Array(await file.slice(0, 256).arrayBuffer());
	const ascii = (start: number, end: number) => String.fromCharCode(...bytes.slice(start, end));

	if (bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255) return 'jpg';
	if (bytes[0] === 137 && ascii(1, 4) === 'PNG') return 'png';
	if (ascii(0, 4) === 'RIFF' && ascii(8, 12) === 'WEBP') return 'webp';
	if (bytes[0] === 0 && bytes[1] === 0 && bytes[2] === 1 && bytes[3] === 0) return 'ico';

	if (ascii(4, 8) === 'ftyp') {
		const view = new DataView(bytes.buffer);
		const end = Math.min(view.getUint32(0), bytes.length);

		for (let offset = 8; offset + 4 <= end; offset += 4) {
			if (offset !== 12 && ['avif', 'avis'].includes(ascii(offset, offset + 4))) return 'avif';
		}
	}

	throw new Error('unsupported');
};

export const loadImage = async (blob: Blob, signal?: AbortSignal) => {
	signal?.throwIfAborted();

	const url = URL.createObjectURL(blob);
	const image = new Image();
	const abort = () => (image.src = '');

	signal?.addEventListener('abort', abort, { once: true });

	try {
		image.src = url;
		await image.decode();
		signal?.throwIfAborted();

		checkDimensions(image.naturalWidth, image.naturalHeight);

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

export const decodeImage = async (file: Blob, format: ImageFormat) => loadImage(await imageBlob(file, format));

export const decodeDrawable = async (
	blob: Blob,
	format?: ImageFormat,
	signal?: AbortSignal,
	prepared?: ImageBitmap
) => {
	signal?.throwIfAborted();

	const source = format && !prepared ? await imageBlob(blob, format) : blob;

	signal?.throwIfAborted();

	const image =
		prepared ??
		(typeof document === 'undefined'
			? await createImageBitmap(source, {
					imageOrientation: 'from-image',
					premultiplyAlpha: 'default',
					colorSpaceConversion: 'default',
				}).catch(() => {
					throw new Error('workerDecode');
				})
			: await loadImage(source, signal));

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
		checkDimensions(width, height);
		return { source: image, width, height, close };
	} catch (error) {
		close();
		throw error;
	}
};

const canvasThumbnail = async (blob: Blob, signal?: AbortSignal) => {
	signal?.throwIfAborted();

	const image = await loadImage(blob, signal);

	const width = image.naturalWidth;
	const height = image.naturalHeight;

	try {
		signal?.throwIfAborted();
		const preview = await thumbnailCanvas(image, width, height);
		signal?.throwIfAborted();

		return { width, height, preview };
	} finally {
		image.src = '';
	}
};

export const thumbnail = async (blob: Blob, signal?: AbortSignal) => {
	signal?.throwIfAborted();

	if (typeof document === 'undefined') {
		const image = await decodeDrawable(blob);

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
				worker.postMessage(blob);
			} catch (error) {
				cleanup();
				reject(error);
			}
		});
	} catch (error) {
		signal?.throwIfAborted();

		if (error instanceof Error && error.message === 'pixels') throw error;
		return canvasThumbnail(blob, signal);
	}
};

export const inspectImage = async (file: File, mode: Mode = 'converter', signal?: AbortSignal) => {
	signal?.throwIfAborted();

	if (file.size > IMAGES.MAX_BYTES) throw new Error('size');

	const format = await detectFormat(file);
	signal?.throwIfAborted();

	if (mode === 'compression' && format === 'ico') throw new Error('compressionUnsupported');
	if (mode === 'resize' && format === 'ico') throw new Error('resizeUnsupported');

	const original = await imageBlob(file, format);

	return { ...(await thumbnail(original, signal)), format, original };
};

export const convertImage = async (
	file: File,
	sourceFormat: ImageFormat,
	format: ImageFormat,
	encodeAvif: AvifEncoder,
	quality = 0.9,
	dimensions?: Dimensions,
	signal?: AbortSignal,
	prepared?: ImageBitmap
) => {
	signal?.throwIfAborted();
	if (dimensions) checkDimensions(dimensions.width, dimensions.height);

	const image = await decodeDrawable(file, sourceFormat, signal, prepared);
	let surface: ReturnType<typeof createCanvas> | undefined;

	try {
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
		} else if (format === 'avif') {
			const data = context.getImageData(0, 0, canvas.width, canvas.height);

			blob = new Blob([await encodeAvif(data)], { type: IMAGES.MIME.avif });
			preview = blob;
		} else {
			blob = await canvasBlob(canvas, IMAGES.MIME[format], quality);
			preview = blob;
		}

		if ((await detectFormat(blob)) !== format) throw new Error('encode');
		signal?.throwIfAborted();

		return {
			blob,
			preview:
				format === 'ico'
					? preview
					: format === 'png' && typeof document === 'undefined'
						? await thumbnailCanvas(canvas, canvas.width, canvas.height)
						: (await thumbnail(preview, signal)).preview,
			fullPreview: preview,
			width: format === 'ico' ? 48 : canvas.width,
			height: format === 'ico' ? 48 : canvas.height,
		};
	} finally {
		image.close();
		if (surface) surface.canvas.width = surface.canvas.height = 0;
	}
};
