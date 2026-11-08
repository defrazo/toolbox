import { IMAGES } from '../../model/constants';
import type { BackgroundSettings } from '../../model/types';

const clamp = (value: number, max: number, fallback: number) =>
	Number.isFinite(value) ? Math.min(max, Math.max(0, value)) : fallback;

export const normalizeBackgroundSettings = (settings: BackgroundSettings): BackgroundSettings => ({
	mode: settings.mode === 'global' ? 'global' : 'contiguous',
	tolerance: clamp(settings.tolerance, 100, IMAGES.BACKGROUND.DEFAULT.tolerance),
	feather: clamp(settings.feather, 10, IMAGES.BACKGROUND.DEFAULT.feather),
	sample: {
		x: clamp(settings.sample.x, 1, IMAGES.BACKGROUND.DEFAULT.sample.x),
		y: clamp(settings.sample.y, 1, IMAGES.BACKGROUND.DEFAULT.sample.y),
	},
});

export const removeBackground = (image: ImageData, settings: BackgroundSettings): ImageData => {
	const { width, height, data } = image;
	const pixelCount = width * height;

	if (width < 1 || height < 1 || data.length !== pixelCount * 4) throw new Error('decode');

	const { mode, tolerance, feather, sample } = normalizeBackgroundSettings(settings);
	const output = new Uint8ClampedArray(data);

	const sampleX = Math.min(width - 1, Math.floor(sample.x * width));
	const sampleY = Math.min(height - 1, Math.floor(sample.y * height));
	const seed = sampleY * width + sampleX;
	const sampleOffset = seed * 4;

	if (data[sampleOffset + 3] === 0) return new ImageData(output, width, height);

	const threshold = tolerance / 100;
	const transition = Math.min(1, threshold + feather / 100);
	const maxDistance = Math.sqrt(3) * 255;

	const distance = (pixel: number) => {
		const offset = pixel * 4;

		return (
			Math.hypot(
				data[offset] - data[sampleOffset],
				data[offset + 1] - data[sampleOffset + 1],
				data[offset + 2] - data[sampleOffset + 2]
			) / maxDistance
		);
	};

	const applyAlpha = (pixel: number) => {
		const offset = pixel * 4;
		if (data[offset + 3] === 0) return;

		const value = distance(pixel);

		const fraction =
			value <= threshold ? 0 : value >= transition ? 1 : (value - threshold) / (transition - threshold);

		const alpha = fraction * fraction * (3 - 2 * fraction);

		output[offset + 3] = Math.round(data[offset + 3] * alpha);
	};

	if (mode === 'global') {
		for (let pixel = 0; pixel < pixelCount; pixel++) {
			applyAlpha(pixel);
		}
	} else {
		const visited = new Uint8Array(pixelCount);
		const queue = new Uint32Array(pixelCount);

		let head = 0;
		let tail = 0;

		const visit = (pixel: number) => {
			if (visited[pixel]) return;

			visited[pixel] = 1;

			if (data[pixel * 4 + 3] === 0) return;
			if (distance(pixel) > transition) return;

			queue[tail++] = pixel;
		};

		visit(seed);

		while (head < tail) {
			const pixel = queue[head++];

			applyAlpha(pixel);

			const x = pixel % width;

			if (x > 0) visit(pixel - 1);
			if (x < width - 1) visit(pixel + 1);
			if (pixel >= width) visit(pixel - width);
			if (pixel + width < pixelCount) visit(pixel + width);
		}
	}

	return new ImageData(output, width, height);
};
