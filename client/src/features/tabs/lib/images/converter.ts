import { type ImageFormat, IMAGES, type Mode } from '../../model';

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

export const checkDimensions = (width: number, height: number) => {
	if (
		!Number.isSafeInteger(width) ||
		!Number.isSafeInteger(height) ||
		width < 1 ||
		height < 1 ||
		width * height > IMAGES.CONVERTER.MAX_PIXELS ||
		Math.max(width, height) > IMAGES.MAX_SIDE
	) {
		throw new Error('pixels');
	}
};

export const canvasBlob = (canvas: HTMLCanvasElement, mime: string, quality = 0.9): Promise<Blob> =>
	new Promise((resolve, reject) => {
		canvas.toBlob(
			(blob) => {
				if (!blob || blob.type !== mime) {
					reject(new Error('encode'));
					return;
				}

				resolve(blob);
			},
			mime,
			quality
		);
	});

export const createCanvas = (width: number, height: number) => {
	const canvas = document.createElement('canvas');
	canvas.width = width;
	canvas.height = height;

	const context = canvas.getContext('2d');
	if (!context) throw new Error('encode');

	return { canvas, context };
};

export const loadImage = async (blob: Blob) => {
	const url = URL.createObjectURL(blob);
	const image = new Image();

	try {
		image.src = url;
		await image.decode();

		checkDimensions(image.naturalWidth, image.naturalHeight);

		return image;
	} catch (error) {
		image.src = '';
		throw error;
	} finally {
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

export const thumbnail = async (blob: Blob) => {
	const image = await loadImage(blob);
	const width = image.naturalWidth;
	const height = image.naturalHeight;
	const scale = Math.min(1, 160 / Math.max(width, height));

	const { canvas, context } = createCanvas(
		Math.max(1, Math.round(width * scale)),
		Math.max(1, Math.round(height * scale))
	);

	try {
		context.drawImage(image, 0, 0, canvas.width, canvas.height);

		const preview = await canvasBlob(canvas, IMAGES.MIME.png);

		return { width, height, preview };
	} finally {
		image.src = '';
		canvas.width = canvas.height = 0;
	}
};

export const inspectImage = async (file: File, mode: Mode = 'converter') => {
	if (file.size > IMAGES.MAX_BYTES) throw new Error('size');

	const format = await detectFormat(file);

	if (mode === 'compression' && format === 'ico') throw new Error('compressionUnsupported');
	if (mode === 'resize' && format === 'ico') throw new Error('resizeUnsupported');

	const original = await imageBlob(file, format);

	return { ...(await thumbnail(original)), format, original };
};

export const convertImage = async (
	file: File,
	sourceFormat: ImageFormat,
	format: ImageFormat,
	encodeAvif: AvifEncoder,
	quality = 0.9,
	dimensions?: Dimensions
) => {
	if (dimensions) checkDimensions(dimensions.width, dimensions.height);

	const image = await decodeImage(file, sourceFormat);
	const { canvas, context } = createCanvas(
		dimensions?.width ?? image.naturalWidth,
		dimensions?.height ?? image.naturalHeight
	);

	try {
		if (format === 'jpg') {
			context.fillStyle = '#ffffff';
			context.fillRect(0, 0, canvas.width, canvas.height);
		}

		context.drawImage(image, 0, 0, canvas.width, canvas.height);

		let blob: Blob;
		let preview: Blob;

		if (format === 'ico') {
			const { encodeIco } = await import('icojs/browser');
			const icons: { buffer: ArrayBuffer; usePngIcon: boolean }[] = [];
			let largest: Blob | undefined;

			for (const size of [16, 32, 48]) {
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

		return {
			blob,
			preview: (await thumbnail(preview)).preview,
			fullPreview: preview,
			width: format === 'ico' ? 48 : canvas.width,
			height: format === 'ico' ? 48 : canvas.height,
		};
	} finally {
		image.src = '';
		canvas.width = canvas.height = 0;
	}
};
