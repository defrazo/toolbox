import type { ImageWorkerRequest } from '../model/types';
import { optimisePng } from './codecs';
import { isMemoryAllocationError } from './memory';

self.onmessage = async ({ data }: MessageEvent<ImageWorkerRequest>) => {
	try {
		const buffer = await optimisePng(data.buffer);

		self.postMessage({ buffer }, { transfer: [buffer] });
	} catch (error) {
		self.postMessage({ error: isMemoryAllocationError(error) ? 'memoryAllocation' : 'encode' });
	}
};
