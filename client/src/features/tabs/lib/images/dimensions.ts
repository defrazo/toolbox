import { IMAGES } from '../../model/constants';

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
