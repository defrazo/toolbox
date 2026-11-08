import { type PointerEvent, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { cn } from '@/shared/lib/utils';
import { Button, Preloader } from '@/shared/ui';

import { readBackgroundImage } from '../../../lib/images';
import { type BackgroundRequest, type BackgroundSettings, type ImageFile, IMAGES } from '../../../model';

interface BackgroundPreviewProps {
	file: ImageFile;
	picking: boolean;
	busy: boolean;
	zoom: number;
	onSampleChange: (id: string, sample: BackgroundSettings['sample']) => void;
	onSampleColor: (id: string, sample: BackgroundSettings['sample'], hex: string) => void;
}

type PreviewPointerEvent = PointerEvent<HTMLButtonElement | HTMLDivElement>;
type Backdrop = 'checker' | 'white' | 'dark';
type PreviewError = 'decode' | 'encode';
type PreviewResult = { key: string; image: ImageData };
type PreviewSource = { file: File; format: NonNullable<ImageFile['format']>; image: ImageData };
type Gesture = { pointerId: number; startX: number; startY: number; x: number; y: number; moved: boolean };

const PADDING = 40;

const BACKDROPS = {
	checker: {
		backgroundColor: '#fff',
		backgroundImage:
			'linear-gradient(45deg, #d4d4d4 25%, transparent 25%), linear-gradient(-45deg, #d4d4d4 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #d4d4d4 75%), linear-gradient(-45deg, transparent 75%, #d4d4d4 75%)',
		backgroundSize: '16px 16px',
		backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0px',
	},
	white: { backgroundColor: '#fff' },
	dark: { backgroundColor: '#202024' },
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const toHex = (channels: Uint8ClampedArray) =>
	`#${Array.from(channels.slice(0, 3))
		.map((channel) => channel.toString(16).padStart(2, '0'))
		.join('')
		.toUpperCase()}`;

export const BackgroundPreview = (props: BackgroundPreviewProps) => (
	<BackgroundPreviewContent key={props.file.id} {...props} />
);

const BackgroundPreviewContent = ({
	file,
	picking,
	busy,
	zoom,
	onSampleChange,
	onSampleColor,
}: BackgroundPreviewProps) => {
	const { t } = useTranslation('images');

	const [source, setSource] = useState<PreviewSource | null>(null);
	const [result, setResult] = useState<PreviewResult | null>(null);
	const [error, setError] = useState<PreviewError | null>(null);
	const [backdrop, setBackdrop] = useState<Backdrop>('checker');
	const [viewport, setViewport] = useState({ width: 0, height: 0 });
	const [offset, setOffset] = useState({ x: 0, y: 0 });
	const [dragging, setDragging] = useState(false);

	const canvasRef = useRef<HTMLCanvasElement>(null);
	const imageRef = useRef<HTMLImageElement>(null);
	const originalViewportRef = useRef<HTMLButtonElement>(null);
	const resultViewportRef = useRef<HTMLDivElement>(null);
	const gesture = useRef<Gesture | null>(null);

	const settings = file.background ?? IMAGES.BACKGROUND.DEFAULT;
	const { sample } = settings;

	const originalWidth = file.width ?? 1;
	const originalHeight = file.height ?? 1;

	const fitScale = Math.min(
		1,
		Math.max(1, viewport.width - PADDING) / originalWidth,
		Math.max(1, viewport.height - PADDING) / originalHeight
	);

	const scale = (fitScale * zoom) / 100;
	const width = originalWidth * scale;
	const height = originalHeight * scale;

	const maxX = Math.max(0, (width + PADDING - viewport.width) / 2);
	const maxY = Math.max(0, (height + PADDING - viewport.height) / 2);

	const pan = { x: clamp(offset.x, -maxX, maxX), y: clamp(offset.y, -maxY, maxY) };

	const imageStyle = {
		width,
		height,
		left: '50%',
		top: '50%',
		transform: `translate(calc(-50% + ${pan.x}px), calc(-50% + ${pan.y}px))`,
	};

	const requestKey = [settings.mode, settings.tolerance, settings.feather, sample.x, sample.y].join(':');

	const currentSource = source?.file === file.file && source.format === file.format ? source.image : null;

	const currentResult = result?.key === requestKey ? result.image : null;
	const previewReady = !!currentSource && !!currentResult && !error;

	const viewportClasses = cn(
		'core-border relative min-h-0 min-w-0 flex-1 touch-none overflow-hidden bg-(--bg-tertiary)/70 select-none',
		dragging ? 'cursor-grabbing' : maxX > 0 || maxY > 0 ? 'cursor-grab' : 'cursor-default'
	);

	useLayoutEffect(() => {
		const original = originalViewportRef.current;
		const processed = resultViewportRef.current;
		if (!original || !processed) return;

		const measure = () => {
			const width = Math.min(original.clientWidth, processed.clientWidth);
			const height = Math.min(original.clientHeight, processed.clientHeight);

			setViewport((current) =>
				current.width === width && current.height === height ? current : { width, height }
			);
		};

		measure();

		const observer = new ResizeObserver(measure);
		observer.observe(original);
		observer.observe(processed);

		return () => observer.disconnect();
	}, [file.originalUrl]);

	useEffect(() => {
		setOffset((current) => {
			const x = clamp(current.x, -maxX, maxX);
			const y = clamp(current.y, -maxY, maxY);
			return x === current.x && y === current.y ? current : { x, y };
		});
	}, [maxX, maxY]);

	useEffect(() => {
		let active = true;

		if (!file.format) return;

		void readBackgroundImage(file.file, file.format, IMAGES.BACKGROUND.PREVIEW_SIDE).then(
			(image) => {
				if (!active) return;

				setSource({ file: file.file, format: file.format!, image });
				setError(null);
			},
			() => {
				if (!active) return;

				setSource(null);
				setResult(null);
				setError('decode');
			}
		);

		return () => {
			active = false;
		};
	}, [file.file, file.format]);

	useEffect(() => {
		if (!currentSource || busy) return;

		let active = true;
		let worker: Worker | null = null;

		const terminate = () => {
			worker?.terminate();
			worker = null;
		};

		const fail = () => {
			terminate();

			if (active) {
				setResult(null);
				setError('encode');
			}
		};

		const timer = window.setTimeout(() => {
			try {
				worker = new Worker(new URL('../../../lib/images/background.worker.ts', import.meta.url), {
					type: 'module',
				});

				worker.onerror = (event) => {
					event.preventDefault();
					fail();
				};

				worker.onmessageerror = fail;

				worker.onmessage = ({ data }: MessageEvent<{ buffer?: ArrayBuffer; error?: string }>) => {
					terminate();

					if (!active) return;

					if (!data.buffer || data.buffer.byteLength !== currentSource.data.byteLength) {
						fail();
						return;
					}

					try {
						const image = new ImageData(
							new Uint8ClampedArray(data.buffer),
							currentSource.width,
							currentSource.height
						);

						setResult({ key: requestKey, image });
						setError(null);
					} catch {
						fail();
					}
				};

				const image = new ImageData(
					new Uint8ClampedArray(currentSource.data),
					currentSource.width,
					currentSource.height
				);

				const request: BackgroundRequest = {
					format: 'background',
					image,
					settings: {
						mode: settings.mode,
						tolerance: settings.tolerance,
						feather: settings.feather,
						sample: { x: sample.x, y: sample.y },
					},
				};

				worker.postMessage(request, [image.data.buffer]);
			} catch {
				fail();
			}
		}, 150);

		return () => {
			active = false;
			window.clearTimeout(timer);
			terminate();
		};
	}, [currentSource, requestKey, settings.mode, settings.tolerance, settings.feather, sample.x, sample.y, busy]);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		if (!currentResult || error) {
			canvas.width = 0;
			canvas.height = 0;
			return;
		}

		canvas.width = currentResult.width;
		canvas.height = currentResult.height;

		const context = canvas.getContext('2d');
		if (!context) return;

		context.putImageData(currentResult, 0, 0);

		return () => {
			canvas.width = 0;
			canvas.height = 0;
		};
	}, [currentResult, error]);

	const readSampleColor = useCallback(() => {
		const image = imageRef.current;
		if (!image?.complete || !image.naturalWidth) return;

		const canvas = document.createElement('canvas');
		canvas.width = 1;
		canvas.height = 1;

		try {
			const context = canvas.getContext('2d');
			if (!context) return;

			const x = clamp(Math.floor(sample.x * image.naturalWidth), 0, image.naturalWidth - 1);
			const y = clamp(Math.floor(sample.y * image.naturalHeight), 0, image.naturalHeight - 1);

			context.drawImage(image, x, y, 1, 1, 0, 0, 1, 1);

			const pixels = context.getImageData(0, 0, 1, 1).data;

			onSampleColor(file.id, { x: sample.x, y: sample.y }, toHex(pixels));
		} catch {
		} finally {
			canvas.width = 0;
			canvas.height = 0;
		}
	}, [file.id, sample.x, sample.y, onSampleColor]);

	useEffect(() => {
		readSampleColor();
	}, [readSampleColor]);

	const startPan = (event: PreviewPointerEvent) => {
		if (busy || !event.isPrimary || event.button !== 0 || gesture.current) return;

		gesture.current = {
			pointerId: event.pointerId,
			startX: event.clientX,
			startY: event.clientY,
			x: pan.x,
			y: pan.y,
			moved: false,
		};

		event.currentTarget.setPointerCapture(event.pointerId);
	};

	const movePan = (event: PreviewPointerEvent) => {
		const current = gesture.current;
		if (!current || current.pointerId !== event.pointerId) return;

		const dx = event.clientX - current.startX;
		const dy = event.clientY - current.startY;

		if (!current.moved && Math.hypot(dx, dy) < 5) return;

		current.moved = true;
		event.preventDefault();

		setDragging(true);
		setOffset({ x: clamp(current.x + dx, -maxX, maxX), y: clamp(current.y + dy, -maxY, maxY) });
	};

	const cancelPan = (event: PreviewPointerEvent) => {
		if (gesture.current?.pointerId !== event.pointerId) return;

		gesture.current = null;
		setDragging(false);
	};

	const finishPan = (event: PreviewPointerEvent, allowSample: boolean) => {
		const current = gesture.current;
		if (!current || current.pointerId !== event.pointerId) return;

		gesture.current = null;
		setDragging(false);

		if (event.currentTarget.hasPointerCapture(event.pointerId))
			event.currentTarget.releasePointerCapture(event.pointerId);

		if (current.moved || !allowSample || !picking || busy) return;

		const image = imageRef.current;
		if (!image) return;

		const bounds = event.currentTarget.getBoundingClientRect();
		const imageBounds = image.getBoundingClientRect();

		const insideViewport =
			event.clientX >= bounds.left &&
			event.clientX <= bounds.right &&
			event.clientY >= bounds.top &&
			event.clientY <= bounds.bottom;

		const insideImage =
			event.clientX >= imageBounds.left &&
			event.clientX <= imageBounds.right &&
			event.clientY >= imageBounds.top &&
			event.clientY <= imageBounds.bottom;

		if (!insideViewport || !insideImage) return;

		onSampleChange(file.id, {
			x: clamp((event.clientX - imageBounds.left) / imageBounds.width, 0, 1),
			y: clamp((event.clientY - imageBounds.top) / imageBounds.height, 0, 1),
		});
	};

	const handleSampleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
		if (!picking || busy) return;

		const directions: Record<string, [number, number]> = {
			ArrowLeft: [-1, 0],
			ArrowRight: [1, 0],
			ArrowUp: [0, -1],
			ArrowDown: [0, 1],
		};

		const direction = directions[event.key];
		if (!direction) return;

		event.preventDefault();

		onSampleChange(file.id, {
			x: clamp(sample.x + direction[0] / (file.width ?? 100), 0, 1),
			y: clamp(sample.y + direction[1] / (file.height ?? 100), 0, 1),
		});
	};

	const previewError = file.error ? t(($) => $.errors[file.error!]) : error ? t(($) => $.errors[error]) : null;

	return (
		<section
			className="core-border flex min-w-0 shrink-0 flex-col gap-3 bg-(--bg-secondary)/70 p-3 xl:h-full"
			id="background-preview"
		>
			{file.originalUrl ? (
				<div className="grid h-[clamp(280px,45dvh,560px)] min-h-0 min-w-0 grid-rows-2 gap-3 sm:grid-cols-2 sm:grid-rows-1 xl:h-auto xl:flex-1">
					<div className="flex min-h-0 min-w-0 flex-col">
						<span className="mb-1 text-sm text-(--color-secondary) select-none">
							{t(($) => $.original)}
						</span>
						<button
							ref={originalViewportRef}
							className={cn(
								viewportClasses,
								'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent-primary-hover) disabled:cursor-default',
								picking && !dragging && 'cursor-crosshair'
							)}
							disabled={busy}
							type="button"
							onKeyDown={handleSampleKeyDown}
							onLostPointerCapture={cancelPan}
							onPointerCancel={cancelPan}
							onPointerDown={startPan}
							onPointerMove={movePan}
							onPointerUp={(event) => finishPan(event, true)}
						>
							<div
								className="pointer-events-none absolute"
								style={{ ...imageStyle, ...BACKDROPS[backdrop] }}
							>
								<img
									ref={imageRef}
									alt={file.file.name}
									className="block size-full max-w-none object-contain"
									draggable={false}
									src={file.originalUrl}
									onLoad={readSampleColor}
								/>
								<span
									className="pointer-events-none absolute size-3 -translate-1/2 rounded-full border-2 border-white bg-black/40 ring-1 ring-black"
									style={{ left: `${sample.x * 100}%`, top: `${sample.y * 100}%` }}
								/>
							</div>
						</button>
					</div>
					<div className="flex min-h-0 min-w-0 flex-col">
						<span className="mb-1 text-sm text-(--color-secondary) select-none">{t(($) => $.result)}</span>
						<div
							ref={resultViewportRef}
							className={viewportClasses}
							onLostPointerCapture={cancelPan}
							onPointerCancel={cancelPan}
							onPointerDown={startPan}
							onPointerMove={movePan}
							onPointerUp={(event) => finishPan(event, false)}
						>
							<div
								className="pointer-events-none absolute"
								style={{ ...imageStyle, ...BACKDROPS[backdrop] }}
							>
								<canvas
									ref={canvasRef}
									className={cn('block size-full', !previewReady && 'invisible')}
								/>
							</div>
						</div>
					</div>
				</div>
			) : (
				<div className="flex min-h-[280px] flex-1 flex-col items-center justify-center gap-3">
					{!previewError && <Preloader className="size-8" />}
					<span
						className={cn(
							'text-center text-lg font-medium',
							previewError ? 'text-(--status-error)' : 'text-(--color-accent)'
						)}
						role={previewError ? 'alert' : 'status'}
					>
						{previewError ?? t(($) => $.status[file.status])}
					</span>
				</div>
			)}
			<div className="flex flex-wrap items-center gap-2">
				{(['checker', 'white', 'dark'] as const).map((value) => (
					<Button
						key={value}
						aria-pressed={backdrop === value}
						className={cn('h-7 rounded-lg', backdrop === value && 'active-btn')}
						size="sm"
						onClick={() => setBackdrop(value)}
					>
						{t(($) => $.background.backdrops[value])}
					</Button>
				))}
				{file.originalUrl && previewError && (
					<span className="ml-auto text-xs text-(--status-error)" role="alert">
						{previewError}
					</span>
				)}
			</div>
		</section>
	);
};
