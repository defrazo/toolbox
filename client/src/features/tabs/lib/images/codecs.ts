export const encodeAvif = async (image: ImageData, quality?: number) => {
	const { default: encode } = await import('@jsquash/avif/encode.js');
	return encode(image, quality === undefined ? {} : { quality });
};

export const optimisePng = async (buffer: ArrayBuffer) => {
	const { default: optimise } = await import('@jsquash/oxipng/optimise.js');
	return optimise(buffer, { level: 2, optimiseAlpha: false });
};
