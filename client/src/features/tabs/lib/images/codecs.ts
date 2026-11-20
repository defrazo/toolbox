export const optimisePng = async (buffer: ArrayBuffer) => {
	const { default: optimise } = await import('@jsquash/oxipng/optimise.js');
	return optimise(buffer, { level: 2, optimiseAlpha: false });
};
