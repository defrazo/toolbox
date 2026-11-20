import { IMAGES } from '../model/constants';
import { type ImagePolicy, imagePolicy } from '../model/imagePolicy';
import type { ImageFormat } from '../model/types';
import { convertImage, verifyImageOutput } from './converter';
import { checkDimensions } from './dimensions';
import { readImageDimensions } from './headers';

export const compressImage = async (
	file: File,
	format: ImageFormat,
	quality: number,
	optimisePng: (data: ArrayBuffer) => Promise<ArrayBuffer>,
	signal?: AbortSignal,
	policy: ImagePolicy = imagePolicy({ mode: 'compression', format })
) => {
	signal?.throwIfAborted();

	if (format === 'ico') throw new Error('compressionUnsupported');

	if (format !== 'png')
		return convertImage(file, format, format, quality / 100, undefined, signal, undefined, policy);

	const source = await readImageDimensions(file);
	if (!source) throw new Error('decode');

	const { width, height } = source;
	checkDimensions(width, height, policy.input);

	let buffer: ArrayBuffer | null = await file.arrayBuffer();

	signal?.throwIfAborted();

	let pending: Promise<ArrayBuffer> | null = optimisePng(buffer);
	buffer = null;
	let optimised: ArrayBuffer | null = await pending;
	pending = null;

	const blob = new Blob([optimised], { type: IMAGES.MIME.png });
	optimised = null;

	await verifyImageOutput(blob, 'png', width, height, policy.output, signal);

	signal?.throwIfAborted();
	return { blob, width, height, preview: blob, fullPreview: blob };
};
