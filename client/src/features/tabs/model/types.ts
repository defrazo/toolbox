import type { Layout } from '@/entities/tool';

import type { TabId } from './tabsStore';

export type TabLayoutProps = {
	onLayoutChange?: (layout: Layout | null) => void;
};

export type Tab = { id: TabId; title: string };

// Links
export type ShortLink = {
	id: number;
	code: string;
	shortUrl: string;
	originalUrl: string;
	clicks: number;
	createdAt: string;
	locked: boolean;
};

export type ShortLinkDb = {
	id: number;
	code: string;
	short_url: string;
	original_url: string;
	clicks: number;
	created_at: string;
	locked: boolean;
};

export type ApiResponse<T> = {
	data: T;
	code?: string;
};

// Images
type Result = {
	blob: Blob;
	url: string;
	fullUrl: string;
	name: string;
	format: ImageOutputFormat;
	width: number;
	height: number;
};

export type Mode = 'converter' | 'compression' | 'resize' | 'vectorize' | 'crop';

export type ImageWorkerRequest =
	{ format: 'avif'; image: ImageData; quality?: number } | { format: 'png'; buffer: ArrayBuffer };

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
	result?: Result;
};

// Converter
export type ImageFormat = 'jpg' | 'png' | 'webp' | 'avif' | 'ico';

export type ImageOutputFormat = ImageFormat | 'svg';

export type ImageError =
	| 'unsupported'
	| 'compressionUnsupported'
	| 'resizeUnsupported'
	| 'resizeSettings'
	| 'vectorUnsupported'
	| 'vectorEmpty'
	| 'vectorSize'
	| 'size'
	| 'pixels'
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
	| { width?: undefined; height?: undefined; error: 'resizeSettings' | 'pixels' };

// Vectorize
export type VectorSettings = {
	detail: 'low' | 'medium' | 'high';
	colors: 2 | 4 | 8 | 16 | 32;
};

export type VectorTraceRequest = {
	format: 'svg';
	image: ImageData;
	width: number;
	height: number;
	settings: VectorSettings;
};

// Crop
export type CropTransform = {
	rotation: number;
	flipX: boolean;
	flipY: boolean;
};

export type CropOutputPlan = {
	width: number;
	height: number;
	error?: 'settings' | 'pixels';
};

export type CropSource = {
	image: HTMLImageElement;
	name: string;
	bytes: number;
	format: ImageFormat;
};

export type CropFormat = 'png' | 'jpg' | 'webp';

export type CropAspect = 'free' | 'original' | '1:1' | '3:4' | '4:5' | '16:9' | '9:16' | 'custom';

export type CropError = 'unsupported' | 'single' | 'size' | 'pixels' | 'decode' | 'encode';
