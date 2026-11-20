import { type ImagePolicy, imagePolicy } from '../../model/imagePolicy';
import type { ImageFormat, ResizePlan } from '../../model/types';
import { compressImage } from './compression';
import { convertImage } from './converter';
import { resizeImage } from './resize';

export type ImageJob = {
	id: string;
	file: File;
	format: ImageFormat;
	policy?: ImagePolicy;
} & (
	| { mode: 'converter'; output: ImageFormat }
	| { mode: 'compression'; quality: number }
	| { mode: 'resize'; plan: ResizePlan; bitmap?: ImageBitmap }
);

export type ImageJobResult = Awaited<ReturnType<typeof convertImage>>;

export const processImage = (
	job: ImageJob,
	optimisePng: (buffer: ArrayBuffer) => Promise<ArrayBuffer>,
	signal?: AbortSignal
): Promise<ImageJobResult> => {
	signal?.throwIfAborted();

	const policy =
		job.policy ??
		imagePolicy({ mode: job.mode, format: job.format, output: 'output' in job ? job.output : job.format });

	switch (job.mode) {
		case 'converter':
			return convertImage(job.file, job.format, job.output, undefined, undefined, signal, undefined, policy);
		case 'compression':
			return compressImage(job.file, job.format, job.quality, optimisePng, signal, policy);
		case 'resize':
			return resizeImage(job.file, job.format, job.plan, signal, job.bitmap, policy);
	}
};
