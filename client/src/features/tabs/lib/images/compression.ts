import { type ImageFormat, IMAGES } from '../../model';
import { convertImage, detectFormat, thumbnail } from './converter';

export const compressImage = async (
	file: File,
	format: ImageFormat,
	quality: number,
	encodeAvif: (data: ImageData, quality?: number) => Promise<ArrayBuffer>,
	optimisePng: (data: ArrayBuffer) => Promise<ArrayBuffer>
) => {
	if (format === 'ico') throw new Error('compressionUnsupported');
	if (format !== 'png') return convertImage(file, format, format, (data) => encodeAvif(data, quality), quality / 100);

	const buffer = await file.arrayBuffer();
	const optimised = await optimisePng(buffer);
	const blob = new Blob([optimised], { type: IMAGES.MIME.png });

	if ((await detectFormat(blob)) !== 'png') throw new Error('encode');

	return { blob, ...(await thumbnail(blob)), fullPreview: blob };
};
