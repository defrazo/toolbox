import { thumbnailCanvas } from './canvas';
import { checkDimensions, type ImageLimits } from './dimensions';
import { readImageDimensions } from './headers';

export type ThumbnailResponse =
	{ width: number; height: number; preview: Blob } | { error: 'pixels' | 'decode' | 'unsupported' };
export type ThumbnailMessage = ThumbnailResponse | { metadata: { width: number; height: number } };

self.onmessage = async ({
	data,
}: MessageEvent<Blob | { blob: Blob; limits?: ImageLimits; reportMetadata?: boolean }>) => {
	const blob = data instanceof Blob ? data : data.blob;
	const limits = data instanceof Blob ? undefined : data.limits;

	let image: ImageBitmap | undefined;
	let response: ThumbnailResponse;

	try {
		const header = await readImageDimensions(blob);
		if (header) checkDimensions(header.width, header.height, limits);

		if (typeof createImageBitmap !== 'function' || typeof OffscreenCanvas !== 'function')
			throw new Error('unsupported');

		image = await createImageBitmap(blob, {
			imageOrientation: 'from-image',
			premultiplyAlpha: 'default',
			colorSpaceConversion: 'default',
		});

		const { width, height } = image;
		checkDimensions(width, height, limits);

		if (!(data instanceof Blob) && data.reportMetadata) self.postMessage({ metadata: { width, height } });

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
