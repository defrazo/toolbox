import {
	type PointerEvent as ReactPointerEvent,
	type RefObject,
	useCallback,
	useEffect,
	useRef,
	useState,
} from 'react';
import type { PercentCrop } from 'react-image-crop';

import { EMPTY_GUIDES, type Guides, resizeCrop } from '../lib';

interface ResizeState {
	pointerId: number;
	handle: string;
	startX: number;
	startY: number;
	crop: PercentCrop;
}

interface CropResizeOptions {
	viewportRef: RefObject<HTMLDivElement | null>;
	crop: PercentCrop;
	width: number;
	height: number;
	aspect?: number;
	disabled?: boolean;
	onChange: (crop: PercentCrop) => void;
}

export const useCropResize = ({ viewportRef, crop, width, height, aspect, disabled, onChange }: CropResizeOptions) => {
	const [guides, setGuides] = useState<Guides>(EMPTY_GUIDES);

	const resizeRef = useRef<ResizeState | null>(null);
	const cropRef = useRef(crop);

	cropRef.current = crop;

	const endResize = useCallback(() => {
		const resize = resizeRef.current;
		if (!resize) return;

		resizeRef.current = null;
		const element = viewportRef.current;
		if (element?.hasPointerCapture(resize.pointerId)) element.releasePointerCapture(resize.pointerId);

		setGuides(EMPTY_GUIDES);
	}, [viewportRef]);

	useEffect(() => {
		if (disabled) endResize();
	}, [disabled, endResize]);

	useEffect(() => {
		return () => {
			const resize = resizeRef.current;
			if (!resize) return;

			resizeRef.current = null;
			const element = viewportRef.current;

			if (element?.hasPointerCapture(resize.pointerId)) element.releasePointerCapture(resize.pointerId);
		};
	}, [viewportRef]);

	const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
		if (disabled || event.button !== 0 || resizeRef.current) return;

		const target = event.target;
		if (!(target instanceof Element)) return;

		const handle = target.closest('.ReactCrop__drag-handle');
		if (!handle) return;

		const handleName = handle.getAttribute('data-ord');
		if (!handleName) return;

		resizeRef.current = {
			pointerId: event.pointerId,
			handle: handleName,
			startX: event.clientX,
			startY: event.clientY,
			crop: { ...cropRef.current },
		};

		event.preventDefault();
		event.stopPropagation();
		event.currentTarget.setPointerCapture(event.pointerId);
	};

	const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
		const resize = resizeRef.current;
		if (!resize || disabled || event.pointerId !== resize.pointerId) return;
		if (!width || !height) return;

		event.preventDefault();
		event.stopPropagation();

		const result = resizeCrop(resize.crop, resize.handle, {
			width,
			height,
			dx: event.clientX - resize.startX,
			dy: event.clientY - resize.startY,
			alt: event.altKey,
			shift: event.shiftKey,
			ctrl: event.ctrlKey,
			aspect,
		});

		setGuides((current) =>
			current.x === result.guides.x && current.y === result.guides.y ? current : result.guides
		);
		onChange(result.crop);
	};

	const handlePointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
		if (resizeRef.current?.pointerId !== event.pointerId) return;
		event.stopPropagation();
		endResize();
	};

	const handleCropChange = (_: unknown, percent: PercentCrop) => {
		if (!resizeRef.current) onChange(percent);
	};

	return { guides, handlePointerDown, handlePointerMove, handlePointerUp, handleCropChange, endResize };
};
