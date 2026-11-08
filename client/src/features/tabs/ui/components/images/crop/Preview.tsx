import { type RefObject, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReactCrop, { type PercentCrop } from 'react-image-crop';

import { drawCropSource, orientedSize } from '../../../../lib/images';
import { type CropTransform, IMAGES, useCropResize } from '../../../../model';

import 'react-image-crop/dist/ReactCrop.css';

interface PreviewProps {
	image: HTMLImageElement;
	transform: CropTransform;
	zoom: number;
	crop: PercentCrop;
	aspect?: number;
	disabled?: boolean;
	canvasRef: RefObject<HTMLCanvasElement | null>;
	onChange: (crop: PercentCrop) => void;
}

const PADDING = 40;

export const Preview = ({ image, transform, zoom, crop, aspect, disabled, canvasRef, onChange }: PreviewProps) => {
	const { t } = useTranslation('images');

	const [viewport, setViewport] = useState({ width: 600, height: 500 });

	const viewportRef = useRef<HTMLDivElement>(null);

	const size = orientedSize(image.naturalWidth, image.naturalHeight, transform.rotation);
	const availableWidth = Math.max(1, viewport.width - PADDING);
	const availableHeight = Math.max(1, viewport.height - PADDING);
	const fitScale = Math.min(1, availableWidth / size.width, availableHeight / size.height);
	const scale = (fitScale * zoom) / 100;
	const width = size.width * scale;
	const height = size.height * scale;

	const { guides, handlePointerDown, handlePointerMove, handlePointerUp, handleCropChange, endResize } =
		useCropResize({ viewportRef, crop, width, height, aspect, disabled, onChange });

	useEffect(() => {
		const element = viewportRef.current;
		if (!element) return;

		const observer = new ResizeObserver(() => {
			const nextWidth = element.clientWidth;
			const nextHeight = element.clientHeight;

			setViewport((current) =>
				current.width === nextWidth && current.height === nextHeight
					? current
					: { width: nextWidth, height: nextHeight }
			);
		});

		observer.observe(element);
		return () => observer.disconnect();
	}, []);

	useLayoutEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas || !image.naturalWidth) return;

		drawCropSource(canvas, image, transform);
	}, [canvasRef, image, transform]);

	return (
		<div
			ref={viewportRef}
			aria-label={t(($) => $.crop.preview)}
			className="core-scrollbar core-border h-[clamp(280px,45dvh,560px)] min-w-0 overflow-auto bg-(--bg-tertiary)/70 lg:h-[clamp(320px,60dvh,720px)] xl:h-auto xl:min-h-0 xl:flex-1"
			onLostPointerCapture={endResize}
			onPointerCancelCapture={handlePointerUp}
			onPointerDownCapture={handlePointerDown}
			onPointerMoveCapture={handlePointerMove}
			onPointerUpCapture={handlePointerUp}
		>
			<div
				className="flex min-h-full min-w-full items-center justify-center p-5"
				style={{ width: width + PADDING, height: height + PADDING }}
			>
				<ReactCrop
					ariaLabels={{
						cropArea: t(($) => $.crop.frame),
						nwDragHandle: t(($) => $.crop.handles.nw),
						nDragHandle: t(($) => $.crop.handles.n),
						neDragHandle: t(($) => $.crop.handles.ne),
						eDragHandle: t(($) => $.crop.handles.e),
						seDragHandle: t(($) => $.crop.handles.se),
						sDragHandle: t(($) => $.crop.handles.s),
						swDragHandle: t(($) => $.crop.handles.sw),
						wDragHandle: t(($) => $.crop.handles.w),
					}}
					aspect={aspect}
					crop={crop}
					disabled={disabled}
					keepSelection
					minHeight={Math.min(IMAGES.CROP.MIN_SIZE, height)}
					minWidth={Math.min(IMAGES.CROP.MIN_SIZE, width)}
					ruleOfThirds
					style={{ position: 'relative', maxWidth: 'none', flexShrink: 0 }}
					onChange={handleCropChange}
				>
					<canvas
						ref={canvasRef}
						aria-label={t(($) => $.crop.preview)}
						className="block bg-(--bg-secondary)"
						role="img"
						style={{
							width,
							height,
							maxWidth: 'none',
							backgroundImage: 'repeating-conic-gradient(#8882 0% 25%, transparent 0% 50%)',
							backgroundSize: '16px 16px',
						}}
					/>
					{guides.x && (
						<div
							aria-hidden="true"
							className="pointer-events-none absolute inset-y-0 left-1/2 z-20 w-px bg-(--color-accent)"
						/>
					)}
					{guides.y && (
						<div
							aria-hidden="true"
							className="pointer-events-none absolute inset-x-0 top-1/2 z-20 h-px bg-(--color-accent)"
						/>
					)}
				</ReactCrop>
			</div>
		</div>
	);
};
