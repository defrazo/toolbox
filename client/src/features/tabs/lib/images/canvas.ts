export const canvasBlob = async (canvas: HTMLCanvasElement | OffscreenCanvas, mime: string, quality = 0.9) => {
	const blob =
		'convertToBlob' in canvas
			? await canvas.convertToBlob({ type: mime, quality })
			: await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, mime, quality));

	if (!blob || blob.type !== mime) throw new Error('convertToBlob' in canvas ? 'workerUnsupported' : 'encode');
	return blob;
};

export const createCanvas = (width: number, height: number) => {
	if (typeof document === 'undefined') {
		const canvas = new OffscreenCanvas(width, height);
		const context = canvas.getContext('2d');

		if (!context) {
			canvas.width = canvas.height = 0;
			throw new Error('workerUnsupported');
		}

		return { canvas, context };
	}

	const canvas = document.createElement('canvas');
	canvas.width = width;
	canvas.height = height;
	const context = canvas.getContext('2d');

	if (!context) {
		canvas.width = canvas.height = 0;
		throw new Error('encode');
	}

	return { canvas, context };
};

export const thumbnailCanvas = async (image: CanvasImageSource, width: number, height: number) => {
	const scale = Math.min(1, 160 / Math.max(width, height));
	const { canvas, context } = createCanvas(
		Math.max(1, Math.round(width * scale)),
		Math.max(1, Math.round(height * scale))
	);

	try {
		context.drawImage(image, 0, 0, canvas.width, canvas.height);
		return await canvasBlob(canvas, 'image/png');
	} finally {
		canvas.width = canvas.height = 0;
	}
};
