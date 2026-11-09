import type { BackgroundRequest, BackgroundSettings, ImageFormat, ResizePlan } from '../../model/types';
import { removeImageBackground } from './background';
import { compressImage } from './compression';
import { convertImage } from './converter';
import { resizeImage } from './resize';

export type ImageJob = {
	id: string;
	file: File;
	format: ImageFormat;
} & (
	| { mode: 'converter'; output: ImageFormat }
	| { mode: 'compression'; quality: number }
	| { mode: 'resize'; plan: ResizePlan; bitmap?: ImageBitmap }
	| { mode: 'background'; output: 'png' | 'webp'; settings: BackgroundSettings }
);

export type ImageJobResult = Awaited<ReturnType<typeof convertImage>>;

export const processImage = (
	job: ImageJob,
	encodeAvif: (image: ImageData, quality?: number) => Promise<ArrayBuffer>,
	optimisePng: (buffer: ArrayBuffer) => Promise<ArrayBuffer>,
	background: (request: BackgroundRequest) => Promise<ArrayBuffer>,
	signal?: AbortSignal
): Promise<ImageJobResult> => {
	signal?.throwIfAborted();

	switch (job.mode) {
		case 'converter':
			return convertImage(job.file, job.format, job.output, encodeAvif, undefined, undefined, signal);
		case 'compression':
			return compressImage(job.file, job.format, job.quality, encodeAvif, optimisePng, signal);
		case 'resize':
			return resizeImage(job.file, job.format, job.plan, encodeAvif, signal, job.bitmap);
		case 'background':
			return removeImageBackground(job.file, job.format, job.output, job.settings, background, signal);
	}
};
