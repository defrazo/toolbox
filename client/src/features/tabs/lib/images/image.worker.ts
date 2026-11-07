import type { ImageWorkerRequest } from '../../model';

self.onmessage = async ({ data }: MessageEvent<ImageWorkerRequest>) => {
	try {
		let buffer: ArrayBuffer;

		if (data.format === 'avif') {
			const { default: encode } = await import('@jsquash/avif/encode.js');
			buffer = await encode(data.image, data.quality === undefined ? {} : { quality: data.quality });
		} else {
			const { default: optimise } = await import('@jsquash/oxipng/optimise.js');
			buffer = await optimise(data.buffer, { level: 2, optimiseAlpha: false });
		}

		self.postMessage({ buffer }, { transfer: [buffer] });
	} catch {
		self.postMessage({ error: true });
	}
};
