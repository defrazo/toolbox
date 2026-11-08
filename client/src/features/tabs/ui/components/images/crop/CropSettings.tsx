import { useTranslation } from 'react-i18next';
import { FlipHorizontal2, FlipVertical2, Info, RotateCcw, RotateCw } from 'lucide-react';

import { cn } from '@/shared/lib/utils';
import { Button, Input, SelectExt, Tooltip } from '@/shared/ui';

import { formatFileSize } from '../../../../lib';
import { IMAGES, type useCrop } from '../../../../model';

export const CropSettings = ({ editor }: { editor: ReturnType<typeof useCrop> }) => {
	const { t } = useTranslation('images');

	const { outputPlan, result, transform } = editor;
	const disabled = editor.exporting;
	const hasSource = !!editor.source;

	const canPrepare =
		hasSource &&
		!disabled &&
		!outputPlan.error &&
		(editor.aspect !== 'custom' || !!editor.ratio) &&
		editor.crop.width > 0 &&
		editor.crop.height > 0;

	return (
		<div className="flex min-w-0 flex-col gap-3">
			<div className="flex min-w-0 flex-col gap-1.5">
				<span className="text-sm text-(--color-secondary)">{t(($) => $.crop.aspect)}</span>
				<SelectExt
					className="h-8 rounded-lg"
					disabled={disabled}
					options={IMAGES.CROP.ASPECTS.map((value) => ({
						value,
						label:
							value === 'free' || value === 'original' || value === 'custom'
								? t(($) => $.crop[value])
								: value,
					}))}
					value={editor.aspect}
					onChange={editor.setAspect}
				/>
			</div>
			{editor.aspect === 'custom' && (
				<div className="grid grid-cols-2 gap-2">
					{(['width', 'height'] as const).map((side) => (
						<div key={side} className="min-w-0">
							<label className="text-xs" htmlFor={`crop-aspect-${side}`}>
								{t(($) => $.resize[side])}
							</label>
							<Input
								disabled={disabled}
								id={`crop-aspect-${side}`}
								max={1000}
								min={1}
								step={1}
								type="number"
								value={editor.custom[side]}
								onChange={(event) => editor.setCustom(side, event.target.value)}
							/>
						</div>
					))}
				</div>
			)}
			{editor.aspect === 'custom' && !editor.ratio && (
				<p className="text-xs text-(--status-error)">{t(($) => $.crop.aspectHint)}</p>
			)}
			<div className="flex flex-col gap-1.5">
				<div className="flex items-center gap-2">
					<label className="text-sm text-(--color-secondary)" htmlFor="crop-zoom">
						{t(($) => $.crop.zoom)}: {editor.zoom}%
					</label>
					<Tooltip content={t(($) => $.crop.transformHint)}>
						<Info className="size-4" />
					</Tooltip>
				</div>
				<Input
					className="h-6 px-0 accent-(--accent-primary)"
					disabled={!hasSource || disabled}
					id="crop-zoom"
					max={400}
					min={25}
					step={5}
					type="range"
					value={editor.zoom}
					variant="custom"
					onChange={(event) => editor.setZoom(Number(event.target.value))}
				/>
			</div>
			<div className="grid grid-cols-2 gap-2">
				<Button
					className="h-8 rounded-lg"
					disabled={!hasSource || disabled}
					leftIcon={<RotateCcw className="size-4" />}
					size="sm"
					onClick={() => editor.rotate(-1)}
				>
					−90°
				</Button>
				<Button
					className="h-8 rounded-lg"
					disabled={!hasSource || disabled}
					leftIcon={<RotateCw className="size-4" />}
					size="sm"
					onClick={() => editor.rotate(1)}
				>
					+90°
				</Button>
				<Button
					aria-pressed={transform.flipX}
					centerIcon={<FlipHorizontal2 className="size-5" />}
					className={cn('h-8 rounded-lg', transform.flipX && 'active-btn')}
					disabled={!hasSource || disabled}
					title={t(($) => $.crop.flipHorizontal)}
					onClick={() => editor.flip('flipX')}
				/>
				<Button
					aria-pressed={transform.flipY}
					centerIcon={<FlipVertical2 className="size-5" />}
					className={cn('h-8 rounded-lg', transform.flipY && 'active-btn')}
					disabled={!hasSource || disabled}
					title={t(($) => $.crop.flipVertical)}
					onClick={() => editor.flip('flipY')}
				/>
			</div>
			<Button className="h-7 rounded-lg text-sm" disabled={!hasSource || disabled} onClick={editor.reset}>
				{t(($) => $.crop.reset)}
			</Button>
			<div className="flex min-w-0 flex-col gap-3 border-t border-(--border-color) pt-3">
				<div className="flex flex-col gap-1.5">
					<span className="text-sm text-(--color-secondary)">{t(($) => $.output)}</span>
					<SelectExt
						className="h-8 rounded-lg"
						disabled={disabled}
						options={IMAGES.CROP.FORMATS.map((value) => ({
							value,
							label: value.toUpperCase(),
						}))}
						value={editor.format}
						onChange={editor.setFormat}
					/>
				</div>
				{editor.format !== 'png' && (
					<div className="flex flex-col gap-1.5">
						<label className="text-sm text-(--color-secondary)" htmlFor="crop-quality">
							{t(($) => $.compression.quality)}: {editor.quality}%
						</label>
						<Input
							className="h-6 px-0 accent-(--accent-primary)"
							disabled={!hasSource || disabled}
							id="crop-quality"
							max={100}
							min={1}
							step={1}
							type="range"
							value={editor.quality}
							variant="custom"
							onChange={(event) => editor.setQuality(Number(event.target.value))}
						/>
					</div>
				)}
				<Button
					className="active-btn w-full min-w-0"
					disabled={!canPrepare}
					onClick={() => void editor.prepare()}
				>
					{disabled ? t(($) => $.busy) : t(($) => $.crop.prepare)}
				</Button>
				{result && (
					<span className="m-auto truncate text-xs font-medium text-(--color-secondary)">
						{t(($) => $.crop.resultInfo, {
							width: result.width,
							height: result.height,
							size: formatFileSize(result.blob.size),
						})}
					</span>
				)}
			</div>
		</div>
	);
};
