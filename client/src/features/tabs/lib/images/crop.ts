import { centerCrop, makeAspectCrop, type PercentCrop } from 'react-image-crop';

import { type CropAspect, type CropFormat, type CropOutputPlan, type CropTransform, IMAGES } from '../../model';
import { canvasBlob, checkDimensions, createCanvas } from './converter';

type Dimensions = { width: number; height: number };

const snap = (value: number) => (Math.abs(value - Math.round(value)) < 1e-7 ? Math.round(value) : value);

export const orientedSize = (width: number, height: number, rotation: number): Dimensions =>
	rotation % 180 === 0 ? { width, height } : { width: height, height: width };

export const cropAspect = (
	value: CropAspect,
	width: number,
	height: number,
	custom: { width: string; height: string }
): number | undefined => {
	if (value === 'free') return undefined;
	if (value === 'original') return width / height;

	if (value !== 'custom') {
		const [w, h] = value.split(':').map(Number);
		return w / h;
	}

	const w = Number(custom.width);
	const h = Number(custom.height);

	return Number.isInteger(w) && Number.isInteger(h) && w > 0 && h > 0 && w <= 1000 && h <= 1000 ? w / h : undefined;
};

export const fitCrop = (aspect: number | undefined, width: number, height: number): PercentCrop =>
	aspect
		? centerCrop(makeAspectCrop({ unit: '%', width: 100 }, aspect, width, height), width, height)
		: { ...IMAGES.CROP.FULL };

export const cropPixels = (crop: PercentCrop, width: number, height: number) => {
	const x = snap(Math.min(width, Math.max(0, (crop.x * width) / 100)));
	const y = snap(Math.min(height, Math.max(0, (crop.y * height) / 100)));

	return {
		x,
		y,
		width: snap(Math.min(width - x, Math.max(0, (crop.width * width) / 100))),
		height: snap(Math.min(height - y, Math.max(0, (crop.height * height) / 100))),
	};
};

export const drawCropSource = (canvas: HTMLCanvasElement, image: HTMLImageElement, transform: CropTransform) => {
	const size = orientedSize(image.naturalWidth, image.naturalHeight, transform.rotation);

	canvas.width = size.width;
	canvas.height = size.height;

	const context = canvas.getContext('2d');
	if (!context) throw new Error('encode');

	context.translate(size.width / 2, size.height / 2);
	context.scale(transform.flipX ? -1 : 1, transform.flipY ? -1 : 1);
	context.rotate((transform.rotation * Math.PI) / 180);
	context.drawImage(image, -image.naturalWidth / 2, -image.naturalHeight / 2);
};

export const planCropOutput = (selection: Dimensions): CropOutputPlan => {
	const width = Math.max(1, Math.round(selection.width));
	const height = Math.max(1, Math.round(selection.height));

	if (selection.width <= 0 || selection.height <= 0) return { width: 0, height: 0, error: 'settings' };

	try {
		checkDimensions(width, height);
	} catch {
		return { width, height, error: 'pixels' };
	}

	return { width, height };
};

export const exportCrop = async (
	source: HTMLCanvasElement,
	selection: ReturnType<typeof cropPixels>,
	plan: CropOutputPlan,
	format: CropFormat,
	quality: number
) => {
	if (plan.error) throw new Error('encode');

	checkDimensions(plan.width, plan.height);

	const { canvas, context } = createCanvas(plan.width, plan.height);

	try {
		if (format === 'jpg') {
			context.fillStyle = '#ffffff';
			context.fillRect(0, 0, plan.width, plan.height);
		}

		context.imageSmoothingEnabled = true;
		context.imageSmoothingQuality = 'high';

		context.drawImage(
			source,
			selection.x,
			selection.y,
			selection.width,
			selection.height,
			0,
			0,
			plan.width,
			plan.height
		);

		return await canvasBlob(canvas, IMAGES.MIME[format], quality / 100);
	} finally {
		canvas.width = canvas.height = 0;
	}
};
