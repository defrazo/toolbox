import { IMAGES } from '../../model/constants';
import type { ImageFormat, ResizePlan, ResizeSettings } from '../../model/types';
import { checkDimensions, convertImage } from './converter';

export const planResize = (width: number, height: number, settings: ResizeSettings): ResizePlan => {
	let nextWidth: number;
	let nextHeight: number;

	if (settings.unit === 'percent') {
		const percent = Number(settings.percent);

		if (!Number.isFinite(percent) || percent < IMAGES.RESIZE.MIN_PERCENT || percent > IMAGES.RESIZE.MAX_PERCENT)
			return { error: 'resizeSettings' };

		nextWidth = Math.max(1, Math.round((width * percent) / 100));
		nextHeight = Math.max(1, Math.round((height * percent) / 100));
	} else {
		const boundWidth = Number(settings.width);
		const boundHeight = Number(settings.height);

		if (
			!Number.isSafeInteger(boundWidth) ||
			!Number.isSafeInteger(boundHeight) ||
			boundWidth < 1 ||
			boundHeight < 1
		) {
			return { error: 'resizeSettings' };
		}

		if (boundWidth > IMAGES.MAX_SIDE || boundHeight > IMAGES.MAX_SIDE) return { error: 'pixels' };

		const scale = Math.min(boundWidth / width, boundHeight / height);

		nextWidth = settings.keepAspect ? Math.max(1, Math.round(width * scale)) : boundWidth;
		nextHeight = settings.keepAspect ? Math.max(1, Math.round(height * scale)) : boundHeight;
	}

	try {
		checkDimensions(nextWidth, nextHeight);

		return { width: nextWidth, height: nextHeight };
	} catch {
		return { error: 'pixels' };
	}
};

export const resizeImage = async (
	file: File,
	format: ImageFormat,
	plan: ResizePlan,
	encodeAvif: (data: ImageData, quality?: number) => Promise<ArrayBuffer>,
	signal?: AbortSignal,
	prepared?: ImageBitmap
) => {
	if (format === 'ico') throw new Error('resizeUnsupported');
	if (plan.error) throw new Error(plan.error);

	return convertImage(file, format, format, (data) => encodeAvif(data, 80), 0.9, plan, signal, prepared);
};
