import type { ModalStore } from '@/features/modal';
import type { NotifyStore } from '@/features/notification';
import type { TabsStore } from '@/features/tabs';

import type { ImageLimits } from './imagePolicy';

export interface ImagesStores {
	modalStore: ModalStore;
	notifyStore: NotifyStore;
	tabsStore: TabsStore;
}

type Result = {
	blob: Blob;
	url?: string;
	fullUrl?: string;
	name: string;
	format: ImageFormat;
	width: number;
	height: number;
};

export type Mode = 'converter' | 'compression' | 'resize' | 'crop';

export type ImageWorkerRequest = { format: 'png'; buffer: ArrayBuffer };

export type ImageFile = {
	id: string;
	file: File;
	format?: ImageFormat;
	width?: number;
	height?: number;
	url?: string;
	originalUrl?: string;
	status: 'loading' | 'ready' | 'processing' | 'done' | 'error';
	error?: ImageError;
	errorLimits?: ImageLimits;
	result?: Result;
};

// Converter
export type ImageFormat = 'jpg' | 'png' | 'webp' | 'ico';

export type ImageError =
	| 'unsupported'
	| 'compressionUnsupported'
	| 'resizeUnsupported'
	| 'resizeSettings'
	| 'size'
	| 'pixels'
	| 'outputPixels'
	| 'outputDimensions'
	| 'webpSide'
	| 'memory'
	| 'batchResolution'
	| 'timeout'
	| 'decode'
	| 'encode';

// Resize
export type ResizeSettings = {
	unit: 'pixels' | 'percent';
	width: string;
	height: string;
	percent: string;
	keepAspect: boolean;
};

export type ResizePlan =
	| { width: number; height: number; error?: undefined }
	| { width?: undefined; height?: undefined; error: 'resizeSettings' | 'pixels' | 'outputPixels' | 'webpSide' };

// Crop
export type CropTransform = {
	rotation: number;
	flipX: boolean;
	flipY: boolean;
};

export type CropOutputPlan = {
	width: number;
	height: number;
	error?: 'settings' | 'pixels' | 'outputPixels' | 'webpSide';
};

export type CropSource = {
	image: HTMLImageElement;
	name: string;
	bytes: number;
	format: ImageFormat;
};

export type CropFormat = 'png' | 'jpg' | 'webp';

export type CropAspect = 'free' | 'original' | '1:1' | '3:4' | '4:5' | '16:9' | '9:16' | 'custom';

export type CropError =
	| 'unsupported'
	| 'single'
	| 'size'
	| 'pixels'
	| 'decode'
	| 'encode'
	| 'cropTransform'
	| 'memory'
	| 'outputPixels'
	| 'webpSide'
	| 'outputDimensions';
