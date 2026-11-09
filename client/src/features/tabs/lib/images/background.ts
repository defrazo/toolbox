import { IMAGES } from '../../model/constants';
import type { BackgroundRequest, BackgroundSettings, ImageFormat } from '../../model/types';
import { thumbnailCanvas } from './canvas';
import { canvasBlob, createCanvas, decodeDrawable, detectFormat, thumbnail } from './converter';

export const readBackgroundImage = async (
	file: File,
	format: ImageFormat,
	maxSide?: number,
	signal?: AbortSignal
): Promise<ImageData> => {
	const image = await decodeDrawable(file, format, signal);

	try {
		const scale = maxSide ? Math.min(1, maxSide / Math.max(image.width, image.height)) : 1;

		const width = Math.max(1, Math.round(image.width * scale));
		const height = Math.max(1, Math.round(image.height * scale));

		const { canvas, context } = createCanvas(width, height);

		try {
			context.drawImage(image.source, 0, 0, width, height);
			image.close();
			return context.getImageData(0, 0, width, height);
		} finally {
			canvas.width = canvas.height = 0;
		}
	} finally {
		image.close();
	}
};

export const removeImageBackground = async (
	file: File,
	format: ImageFormat,
	output: 'png' | 'webp',
	settings: BackgroundSettings,
	run: (request: BackgroundRequest) => Promise<ArrayBuffer>,
	signal?: AbortSignal
) => {
	let image: ImageData | null = await readBackgroundImage(file, format, undefined, signal);

	const { width, height } = image;
	const processed = run({ format: 'background', image, settings });

	image = null;

	const buffer = await processed;

	const { canvas, context } = createCanvas(width, height);

	try {
		const result = new ImageData(new Uint8ClampedArray(buffer), width, height);
		context.putImageData(result, 0, 0);

		const blob = await canvasBlob(canvas, IMAGES.MIME[output]);

		if ((await detectFormat(blob)) !== output) throw new Error('encode');

		const preview =
			output === 'png' && typeof document === 'undefined'
				? await thumbnailCanvas(canvas, width, height)
				: (await thumbnail(blob, signal)).preview;

		return { blob, width, height, preview, fullPreview: blob };
	} finally {
		canvas.width = canvas.height = 0;
	}
};
