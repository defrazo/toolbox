import { useTranslation } from 'react-i18next';
import { FlipHorizontal2, FlipVertical2, Info, RotateCcw, RotateCw } from 'lucide-react';

import { cn } from '@/shared/lib/utils';
import { Button, Input, SelectExt, Tooltip } from '@/shared/ui';

import { formatFileSize } from '../../lib/utils';
import { IMAGES } from '../../model/constants';
import type { useCrop } from '../../model/useCrop';

export const CropSettings = ({ editor }: { editor: ReturnType<typeof useCrop> }) => {
	const { t } = useTranslation('images');

	const { outputPlan, result, transform } = editor;
	const outputError = outputPlan.error;
	const hasSource = !!editor.source;
	const disabled = editor.exporting || !hasSource;

	const canPrepare =
		!disabled &&
		!outputPlan.error &&
		(editor.aspect !== 'custom' || !!editor.ratio) &&
		editor.crop.width > 0 &&
		editor.crop.height > 0;

	return (
		<div className="flex min-w-0 flex-1 flex-col gap-3">
			{outputError && (
				<p className="text-xs text-(--status-error)" role="status">
					{t(($) => $.crop.outputErrors[outputError], {
						megapixels: editor.policy.output.maxPixels / 1_000_000,
						maxSide: editor.policy.output.maxSide,
					})}
				</p>
			)}
			<div className="flex min-w-0 flex-col gap-1.5">
				<span className="text-sm text-(--color-secondary) select-none">{t(($) => $.crop.aspect)}</span>
				<SelectExt
					className="h-7 rounded-lg text-sm"
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
						<div key={side} className="flex min-w-0 flex-col gap-1.5">
							<label
								className="text-sm text-(--color-secondary) select-none"
								htmlFor={`crop-aspect-${side}`}
							>
								{t(($) => $.resize[side])}
							</label>
							<Input
								className="h-7 rounded-lg text-sm"
								disabled={disabled}
								id={`crop-aspect-${side}`}
								max={1000}
								min={1}
								step={1}
								type="number"
								value={editor.custom[side]}
								wheelStep
								onChange={(event) => editor.setCustom(side, event.target.value)}
							/>
						</div>
					))}
				</div>
			)}
			{editor.aspect === 'custom' && !editor.ratio && (
				<span className="text-xs text-(--status-error) select-none">{t(($) => $.crop.aspectHint)}</span>
			)}
			<div className="flex flex-col">
				<div className="flex items-center gap-2 text-(--color-secondary) select-none">
					<span className="text-sm">
						{t(($) => $.crop.zoom)}: {editor.zoom}%
					</span>
					<Tooltip content={t(($) => $.crop.transformHint)}>
						<Info className="size-4" />
					</Tooltip>
				</div>
				<Input
					className="h-6 px-0 accent-(--accent-primary)"
					disabled={disabled}
					id="crop-zoom"
					max={400}
					min={25}
					step={5}
					type="range"
					value={editor.zoom}
					variant="custom"
					wheelStep
					onChange={(event) => editor.setZoom(Number(event.target.value))}
				/>
			</div>
			<div className="flex min-w-0 flex-col gap-1.5">
				<span className="text-sm text-(--color-secondary) select-none">{t(($) => $.crop.transform)}</span>
				<div className="grid grid-cols-2 gap-2">
					<Button
						className="h-7 rounded-lg"
						disabled={disabled}
						leftIcon={<RotateCcw className="size-3.5" />}
						size="sm"
						onClick={() => editor.rotate(-1)}
					>
						−90°
					</Button>
					<Button
						className="h-7 rounded-lg"
						disabled={disabled}
						leftIcon={<RotateCw className="size-3.5" />}
						size="sm"
						onClick={() => editor.rotate(1)}
					>
						+90°
					</Button>
					<Button
						aria-pressed={transform.flipX}
						centerIcon={<FlipVertical2 className="size-3.5" />}
						className={cn('h-7 rounded-lg', transform.flipX && 'active-btn')}
						disabled={disabled}
						title={t(($) => $.crop.flipHorizontal)}
						onClick={() => editor.flip('flipX')}
					/>
					<Button
						aria-pressed={transform.flipY}
						centerIcon={<FlipHorizontal2 className="size-3.5" />}
						className={cn('h-7 rounded-lg', transform.flipY && 'active-btn')}
						disabled={disabled}
						title={t(($) => $.crop.flipVertical)}
						onClick={() => editor.flip('flipY')}
					/>
				</div>
				<Button className="mt-0.5 h-7 rounded-lg text-sm" disabled={disabled} onClick={editor.reset}>
					{t(($) => $.crop.reset)}
				</Button>
			</div>
			<div className="flex min-w-0 flex-1 flex-col gap-2">
				<div className="flex flex-col gap-1.5">
					<span className="text-sm text-(--color-secondary) select-none">{t(($) => $.output)}</span>
					<SelectExt
						className="h-7 rounded-lg text-sm"
						disabled={disabled}
						options={IMAGES.CROP.FORMATS.map((value) => ({ value, label: value.toUpperCase() }))}
						value={editor.format}
						onChange={editor.setFormat}
					/>
				</div>
				{editor.format !== 'png' && (
					<div className="flex flex-col">
						<label className="text-sm text-(--color-secondary) select-none" htmlFor="crop-quality">
							{t(($) => $.compression.quality)}: {editor.quality}%
						</label>
						<Input
							className="h-6 px-0 accent-(--accent-primary)"
							disabled={disabled}
							id="crop-quality"
							max={100}
							min={1}
							step={1}
							type="range"
							value={editor.quality}
							variant="custom"
							wheelStep
							onChange={(event) => editor.setQuality(Number(event.target.value))}
						/>
					</div>
				)}
				<Button
					className="active-btn mt-auto h-8 w-full min-w-0 rounded-lg"
					disabled={!canPrepare}
					onClick={() => void editor.prepare()}
				>
					{editor.exporting ? t(($) => $.busy) : t(($) => $.crop.prepare)}
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
