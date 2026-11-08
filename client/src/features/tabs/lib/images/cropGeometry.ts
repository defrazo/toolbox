import type { PercentCrop } from 'react-image-crop';

import { IMAGES } from '../../model';

export interface Guides {
	x: boolean;
	y: boolean;
}

export interface ResizeOptions {
	width: number;
	height: number;
	dx: number;
	dy: number;
	alt: boolean;
	shift: boolean;
	ctrl: boolean;
	aspect?: number;
}

const SNAP_THRESHOLD = 10;

export const EMPTY_GUIDES: Guides = { x: false, y: false };

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export const resizeCrop = (
	start: PercentCrop,
	handle: string,
	options: ResizeOptions
): { crop: PercentCrop; guides: Guides } => {
	const { width, height, dx, dy, alt, shift, ctrl, aspect } = options;

	const x = (start.x * width) / 100;
	const y = (start.y * height) / 100;
	const w = (start.width * width) / 100;
	const h = (start.height * height) / 100;

	const right = x + w;
	const bottom = y + h;
	const centerX = x + w / 2;
	const centerY = y + h / 2;

	const horizontal = handle.includes('e') ? 1 : handle.includes('w') ? -1 : 0;
	const vertical = handle.includes('s') ? 1 : handle.includes('n') ? -1 : 0;

	const factor = alt ? 2 : 1;

	const rawWidth = w + horizontal * dx * factor;
	const rawHeight = h + vertical * dy * factor;

	const ratio = aspect && aspect > 0 ? aspect : shift && h > 0 ? w / h : undefined;

	const minWidth = Math.min(IMAGES.CROP.MIN_SIZE, width);
	const minHeight = Math.min(IMAGES.CROP.MIN_SIZE, height);

	const maxWidth = alt
		? 2 * Math.min(centerX, width - centerX)
		: horizontal > 0
			? width - x
			: horizontal < 0
				? right
				: width;

	const maxHeight = alt
		? 2 * Math.min(centerY, height - centerY)
		: vertical > 0
			? height - y
			: vertical < 0
				? bottom
				: height;

	let nextWidth = horizontal ? rawWidth : w;
	let nextHeight = vertical ? rawHeight : h;

	if (ratio) {
		if (!vertical) nextHeight = nextWidth / ratio;
		else if (!horizontal) nextWidth = nextHeight * ratio;
		else {
			const widthDelta = Math.abs(nextWidth - w) / Math.max(w, 1);
			const heightDelta = Math.abs(nextHeight - h) / Math.max(h, 1);

			if (widthDelta >= heightDelta) nextHeight = nextWidth / ratio;
			else nextWidth = nextHeight * ratio;
		}

		const maximum = Math.min(maxWidth, maxHeight * ratio);
		nextWidth = clamp(nextWidth, Math.min(minWidth, minHeight * ratio, maximum), maximum);
		nextHeight = nextWidth / ratio;
	} else {
		nextWidth = clamp(nextWidth, Math.min(minWidth, maxWidth), maxWidth);
		nextHeight = clamp(nextHeight, Math.min(minHeight, maxHeight), maxHeight);
	}

	const getPosition = (newWidth: number, newHeight: number) => ({
		left: alt
			? centerX - newWidth / 2
			: horizontal > 0
				? x
				: horizontal < 0
					? right - newWidth
					: centerX - newWidth / 2,
		top: alt
			? centerY - newHeight / 2
			: vertical > 0
				? y
				: vertical < 0
					? bottom - newHeight
					: centerY - newHeight / 2,
	});

	const guides = { ...EMPTY_GUIDES };

	if (!ctrl) {
		const position = getPosition(nextWidth, nextHeight);

		const edgeX = horizontal > 0 ? position.left + nextWidth : horizontal < 0 ? position.left : undefined;
		const edgeY = vertical > 0 ? position.top + nextHeight : vertical < 0 ? position.top : undefined;

		const snapX = edgeX !== undefined && Math.abs(edgeX - width / 2) <= SNAP_THRESHOLD;
		const snapY = edgeY !== undefined && Math.abs(edgeY - height / 2) <= SNAP_THRESHOLD;

		if (snapX || snapY) {
			const snapWidth = snapX
				? Math.abs(width / 2 - (alt ? centerX * 2 - edgeX! : horizontal > 0 ? x : right))
				: nextWidth;

			const snapHeight = snapY
				? Math.abs(height / 2 - (alt ? centerY * 2 - edgeY! : vertical > 0 ? y : bottom))
				: nextHeight;

			if (ratio) {
				if (snapX) {
					nextWidth = snapWidth;
					nextHeight = nextWidth / ratio;
				} else if (snapY) {
					nextHeight = snapHeight;
					nextWidth = nextHeight * ratio;
				}
			} else {
				if (snapX) nextWidth = snapWidth;
				if (snapY) nextHeight = snapHeight;
			}

			guides.x = snapX;
			guides.y = snapY;
		}
	}

	const position = getPosition(nextWidth, nextHeight);

	return {
		crop: {
			unit: '%',
			x: clamp((position.left / width) * 100, 0, 100),
			y: clamp((position.top / height) * 100, 0, 100),
			width: clamp((nextWidth / width) * 100, 0, 100),
			height: clamp((nextHeight / height) * 100, 0, 100),
		},
		guides,
	};
};
