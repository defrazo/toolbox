import { removeBackground } from './backgroundPixels';
import { encodeAvif, optimisePng } from './codecs';
import { type ImageJob, type ImageJobResult, processImage } from './processImage';

export type ProcessingResponse = { id: string } & ({ result: ImageJobResult } | { error: string });

self.onmessage = async ({ data: job }: MessageEvent<ImageJob>) => {
	let response: ProcessingResponse;
	try {
		if (
			typeof createImageBitmap !== 'function' ||
			typeof OffscreenCanvas !== 'function' ||
			typeof OffscreenCanvas.prototype.convertToBlob !== 'function'
		) {
			throw new Error('workerUnsupported');
		}

		if (job.mode === 'resize' && job.format === 'jpg' && !job.plan.error && !job.bitmap)
			throw new Error('workerUnsupported');

		const result = await processImage(
			job,
			encodeAvif,
			optimisePng,
			async (request) => removeBackground(request.image, request.settings).data.buffer as ArrayBuffer
		);

		response = { id: job.id, result };
	} catch (error) {
		response = {
			id: job.id,
			error: error instanceof Error ? error.message : 'encode',
		};
	} finally {
		if (job.mode === 'resize' && job.bitmap?.width) job.bitmap.close();
	}
	self.postMessage(response);
};
