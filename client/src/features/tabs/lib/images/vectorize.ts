import { type ImageFormat, IMAGES, type VectorSettings, type VectorTraceRequest } from '../../model';
import { createCanvas, decodeImage, thumbnail } from './converter';

export const vectorizeImage = async (
	file: File,
	format: ImageFormat,
	settings: VectorSettings,
	trace: (request: VectorTraceRequest) => Promise<ArrayBuffer>
) => {
	if (format === 'ico') throw new Error('vectorUnsupported');

	const image = await decodeImage(file, format);
	const width = image.naturalWidth;
	const height = image.naturalHeight;

	const scale = Math.min(
		1,
		IMAGES.MAX_SIDE / Math.max(width, height),
		Math.sqrt(IMAGES.VECTOR.MAX_PIXELS / (width * height))
	);

	const { canvas, context } = createCanvas(
		Math.max(1, Math.floor(width * scale)),
		Math.max(1, Math.floor(height * scale))
	);

	try {
		context.drawImage(image, 0, 0, canvas.width, canvas.height);

		const data = context.getImageData(0, 0, canvas.width, canvas.height);
		const buffer = await trace({ format: 'svg', image: data, width, height, settings });
		const blob = new Blob([buffer], { type: 'image/svg+xml' });

		return { blob, ...(await thumbnail(blob)), fullPreview: blob };
	} finally {
		image.src = '';
		canvas.width = canvas.height = 0;
	}
};
