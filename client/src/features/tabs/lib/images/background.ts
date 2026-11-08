import { IMAGES } from '../../model/constants';
import type { BackgroundRequest, BackgroundSettings, ImageFormat } from '../../model/types';
import { canvasBlob, createCanvas, decodeImage, detectFormat, thumbnail } from './converter';

export const readBackgroundImage = async (file: File, format: ImageFormat, maxSide?: number): Promise<ImageData> => {
	const image = await decodeImage(file, format);

	try {
		const scale = maxSide ? Math.min(1, maxSide / Math.max(image.naturalWidth, image.naturalHeight)) : 1;

		const width = Math.max(1, Math.round(image.naturalWidth * scale));
		const height = Math.max(1, Math.round(image.naturalHeight * scale));

		const { canvas, context } = createCanvas(width, height);

		try {
			context.drawImage(image, 0, 0, width, height);
			return context.getImageData(0, 0, width, height);
		} finally {
			canvas.width = canvas.height = 0;
		}
	} finally {
		image.src = '';
	}
};

export const removeImageBackground = async (
	file: File,
	format: ImageFormat,
	output: 'png' | 'webp',
	settings: BackgroundSettings,
	run: (request: BackgroundRequest) => Promise<ArrayBuffer>
) => {
	const image = await readBackgroundImage(file, format);
	const buffer = await run({ format: 'background', image, settings });

	const { canvas, context } = createCanvas(image.width, image.height);

	try {
		const result = new ImageData(new Uint8ClampedArray(buffer), image.width, image.height);
		context.putImageData(result, 0, 0);

		const blob = await canvasBlob(canvas, IMAGES.MIME[output]);

		if ((await detectFormat(blob)) !== output) throw new Error('encode');

		return { blob, ...(await thumbnail(blob)), fullPreview: blob };
	} finally {
		canvas.width = canvas.height = 0;
	}
};
