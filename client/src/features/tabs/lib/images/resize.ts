import { IMAGES } from '../../model/constants';
import { type ImagePolicy, imagePolicy } from '../../model/imagePolicy';
import type { ImageFormat, ResizePlan, ResizeSettings } from '../../model/types';
import { convertImage } from './converter';
import { checkOutputDimensions, type ImageLimits } from './dimensions';

export const planResize = (
	width: number,
	height: number,
	settings: ResizeSettings,
	limits?: ImageLimits,
	format?: ImageFormat
): ResizePlan => {
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

		const scale = Math.min(boundWidth / width, boundHeight / height);

		nextWidth = settings.keepAspect ? Math.max(1, Math.round(width * scale)) : boundWidth;
		nextHeight = settings.keepAspect ? Math.max(1, Math.round(height * scale)) : boundHeight;
	}

	try {
		checkOutputDimensions(nextWidth, nextHeight, limits ?? imagePolicy({ mode: 'resize', format }).output, format);

		return { width: nextWidth, height: nextHeight };
	} catch (error) {
		return { error: error instanceof Error && error.message === 'webpSide' ? 'webpSide' : 'outputPixels' };
	}
};

export const resizeImage = async (
	file: File,
	format: ImageFormat,
	plan: ResizePlan,
	signal?: AbortSignal,
	prepared?: ImageBitmap,
	policy: ImagePolicy = imagePolicy({ mode: 'resize', format })
) => {
	if (format === 'ico') throw new Error('resizeUnsupported');
	if (plan.error) throw new Error(plan.error);

	return convertImage(file, format, format, 0.9, plan, signal, prepared, policy);
};
