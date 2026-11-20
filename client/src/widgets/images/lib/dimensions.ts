import { IMAGES } from '../model/constants';
import { DEFAULT_IMAGE_LIMITS, type ImageLimits } from '../model/imagePolicy';

export type { ImageLimits } from '../model/imagePolicy';

export const checkDimensions = (width: number, height: number, limits: ImageLimits = DEFAULT_IMAGE_LIMITS) => {
	if (
		!Number.isSafeInteger(width) ||
		!Number.isSafeInteger(height) ||
		width < 1 ||
		height < 1 ||
		width * height > limits.maxPixels ||
		Math.max(width, height) > limits.maxSide
	) {
		throw new Error('pixels');
	}
};

export const checkOutputDimensions = (width: number, height: number, limits: ImageLimits, format?: string) => {
	if (format === 'webp' && Math.max(width, height) > IMAGES.MAX_WEBP_SIDE) throw new Error('webpSide');

	try {
		checkDimensions(width, height, limits);
	} catch {
		throw new Error('outputPixels');
	}
};
