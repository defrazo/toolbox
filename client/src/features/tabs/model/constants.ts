import type { PercentCrop } from 'react-image-crop';

import type { BackgroundSettings, CropAspect, CropFormat, CropTransform, ImageFormat, ResizeSettings } from './types';

const MB = 1024 * 1024;

export const MAX_FILES = 100;
export const MAX_SIZE = 500 * MB;

export const IMAGES = {
	MAX_FILES: 100,
	MAX_BYTES: 50 * MB,
	MAX_TOTAL_BYTES: 500 * MB,
	MAX_SIDE: 16384,

	CONVERTER: {
		FORMATS: ['jpg', 'png', 'webp', 'avif', 'ico'] as const,
		ACCEPT: '.jpg,.jpeg,.png,.webp,.avif,.ico',
		MAX_PIXELS: 16_000_000,
	},

	COMPRESSION: {
		ACCEPT: '.jpg,.jpeg,.png,.webp,.avif',
	},

	RESIZE: {
		MIN_PERCENT: 0.1,
		MAX_PERCENT: 1000,
		DEFAULT: {
			unit: 'pixels',
			width: '',
			height: '',
			percent: '100',
			keepAspect: true,
		} satisfies ResizeSettings,
	},

	BACKGROUND: {
		FORMATS: ['png', 'webp'] as const,
		DEFAULT: {
			mode: 'contiguous',
			tolerance: 15,
			feather: 2,
			sample: { x: 0.01, y: 0.01 },
		} satisfies BackgroundSettings,
		PREVIEW_SIDE: 1024,
	},

	CROP: {
		DEFAULT: {
			rotation: 0,
			flipX: false,
			flipY: false,
		} satisfies CropTransform,
		FULL: {
			unit: '%',
			x: 0,
			y: 0,
			width: 100,
			height: 100,
		} satisfies PercentCrop,
		MIN_SIZE: 4,
		FORMATS: ['png', 'jpg', 'webp'] as const satisfies readonly CropFormat[],
		ASPECTS: [
			'free',
			'original',
			'1:1',
			'3:4',
			'4:5',
			'16:9',
			'9:16',
			'custom',
		] as const satisfies readonly CropAspect[],
	},

	MIME: {
		jpg: 'image/jpeg',
		png: 'image/png',
		webp: 'image/webp',
		avif: 'image/avif',
		ico: 'image/x-icon',
	} satisfies Record<ImageFormat, string>,
} as const;
