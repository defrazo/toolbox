import type { BackgroundRequest } from '../../model/types';
import { removeBackground } from './backgroundPixels';

self.onmessage = ({ data }: MessageEvent<BackgroundRequest>) => {
	try {
		const result = removeBackground(data.image, data.settings);
		const buffer = result.data.buffer;

		self.postMessage({ buffer }, { transfer: [buffer] });
	} catch {
		self.postMessage({ error: 'encode' });
	}
};
