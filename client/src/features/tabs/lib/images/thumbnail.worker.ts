import { thumbnailCanvas } from './canvas';
import { checkDimensions } from './dimensions';

export type ThumbnailResponse =
	{ width: number; height: number; preview: Blob } | { error: 'pixels' | 'decode' | 'unsupported' };

self.onmessage = async ({ data: blob }: MessageEvent<Blob>) => {
	let image: ImageBitmap | undefined;
	let response: ThumbnailResponse;

	try {
		if (typeof createImageBitmap !== 'function' || typeof OffscreenCanvas !== 'function')
			throw new Error('unsupported');

		image = await createImageBitmap(blob, {
			imageOrientation: 'from-image',
			premultiplyAlpha: 'default',
			colorSpaceConversion: 'default',
		});

		const { width, height } = image;
		checkDimensions(width, height);

		const preview = await thumbnailCanvas(image, width, height);

		response = { width, height, preview };
	} catch (error) {
		const code = error instanceof Error ? error.message : '';
		response = { error: code === 'pixels' || code === 'unsupported' ? code : 'decode' };
	} finally {
		image?.close();
	}

	self.postMessage(response);
};
