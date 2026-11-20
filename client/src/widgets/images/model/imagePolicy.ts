import { IMAGES } from './constants';
import type { CropTransform, ImageFormat, Mode } from './types';

export type ImageDevice = 'desktop' | 'mobile';
export type ImageLimits = { maxPixels: number; maxSide: number };
export type ImagePolicy = { input: ImageLimits; output: ImageLimits; maxFiles: number };

export type ImagePolicyOptions = {
	mode: Mode;
	format?: ImageFormat;
	output?: ImageFormat;
	batch?: boolean;
	transformed?: boolean;
	device?: ImageDevice;
};

const MP = 1_000_000;
const MIB = 1024 * 1024;

const DEFAULT_PIXELS = 16 * MP;

const isNativeFormat = (format?: ImageFormat): boolean =>
	format === undefined || format === 'jpg' || format === 'png' || format === 'webp';

const maxImageSide = (format?: ImageFormat): number => (format === 'webp' ? IMAGES.MAX_WEBP_SIDE : IMAGES.MAX_SIDE);

export const DEFAULT_IMAGE_LIMITS: ImageLimits = { maxPixels: DEFAULT_PIXELS, maxSide: IMAGES.MAX_SIDE };

export const imageDevice = (): ImageDevice => {
	if (typeof navigator === 'undefined') return 'mobile';

	const mobile = (navigator as Navigator & { userAgentData?: { mobile: boolean } }).userAgentData?.mobile;
	const tablet = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;

	return mobile || tablet || /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) ? 'mobile' : 'desktop';
};

export const hasCropTransform = (transform: CropTransform): boolean =>
	transform.rotation % 360 !== 0 || transform.flipX || transform.flipY;

export const imagePolicy = ({
	mode,
	format,
	output,
	batch = false,
	transformed = false,
	device = imageDevice(),
}: ImagePolicyOptions): ImagePolicy => {
	const nativeInput = isNativeFormat(format);
	const nativeOutput = mode !== 'converter' || isNativeFormat(output);

	let maxPixels = DEFAULT_PIXELS;

	if (mode === 'crop') {
		if (device === 'desktop' && !batch && nativeInput) maxPixels = (transformed ? 20 : 40) * MP;
	} else if (nativeInput && nativeOutput) maxPixels = IMAGES.RASTER_MAX_PIXELS;

	return {
		input: { maxPixels, maxSide: maxImageSide(format) },
		output: { maxPixels, maxSide: maxImageSide(output ?? format) },
		maxFiles: mode === 'crop' ? 1 : IMAGES.MAX_FILES,
	};
};

export const imageMemoryBudget = (device = imageDevice()): number => {
	const memory =
		typeof navigator === 'undefined'
			? undefined
			: (navigator as Navigator & { deviceMemory?: number }).deviceMemory;

	return (memory && memory <= 4 ? 384 : device === 'mobile' ? 576 : 1024) * MIB;
};

export const checkImageMemory = (bytes: number, retained = 0, budget = imageMemoryBudget()): void => {
	if (!Number.isFinite(bytes) || bytes < 0 || bytes + retained > budget) throw new Error('memory');
};

export const estimateCropBytes = (width: number, height: number): number => width * height * 20 + 32 * MIB;
