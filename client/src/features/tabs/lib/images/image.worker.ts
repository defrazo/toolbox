import type { ImageWorkerRequest } from '../../model/types';
import { encodeAvif, optimisePng } from './codecs';

self.onmessage = async ({ data }: MessageEvent<ImageWorkerRequest>) => {
	try {
		const buffer =
			data.format === 'avif' ? await encodeAvif(data.image, data.quality) : await optimisePng(data.buffer);

		self.postMessage({ buffer }, { transfer: [buffer] });
	} catch {
		self.postMessage({ error: true });
	}
};
