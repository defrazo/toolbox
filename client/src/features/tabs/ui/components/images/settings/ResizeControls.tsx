import { useTranslation } from 'react-i18next';

import { cn } from '@/shared/lib/utils';
import { Button, Input } from '@/shared/ui';

import { IMAGES, type ResizeSettings } from '../../../../model';

interface ResizeControlsProps {
	resize: ResizeSettings;
	busy: boolean;
	setSide: (side: 'width' | 'height', value: string) => void;
	setUnit: (unit: ResizeSettings['unit']) => void;
	setPercent: (value: string) => void;
	setAspect: (value: boolean) => void;
}

export const ResizeControls = ({ resize, busy, setSide, setUnit, setPercent, setAspect }: ResizeControlsProps) => {
	const { t } = useTranslation('images');

	return (
		<>
			<div aria-label={t(($) => $.resize.scale)} className="flex" role="group">
				{(['pixels', 'percent'] as const).map((unit) => (
					<Button
						key={unit}
						aria-pressed={resize.unit === unit}
						className={cn(
							'h-8 flex-1 rounded-lg first:rounded-r-none last:rounded-l-none',
							resize.unit === unit && 'active-btn'
						)}
						disabled={busy}
						onClick={() => setUnit(unit)}
					>
						{t(($) => $.resize[unit])}
					</Button>
				))}
			</div>
			{resize.unit === 'pixels' ? (
				<>
					<div className="grid grid-cols-2 gap-3">
						{(['width', 'height'] as const).map((side) => (
							<div key={side} className="flex min-w-0 flex-col gap-1">
								<label className="text-sm text-(--color-secondary)" htmlFor={`images-${side}`}>
									{t(($) => $.resize[side])}
								</label>
								<Input
									className="h-8 min-w-0 rounded-lg"
									disabled={busy}
									id={`images-${side}`}
									max={IMAGES.MAX_SIDE}
									min={1}
									placeholder="px"
									step={1}
									type="number"
									value={resize[side]}
									onChange={(event) => setSide(side, event.target.value)}
								/>
							</div>
						))}
					</div>
					<label
						className={cn(
							'flex items-center gap-2 text-sm text-(--color-secondary) transition-colors',
							busy ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:text-(--color-accent)'
						)}
					>
						<input
							checked={resize.keepAspect}
							className="size-4 accent-(--accent-primary)/70"
							disabled={busy}
							type="checkbox"
							onChange={(event) => setAspect(event.target.checked)}
						/>
						{t(($) => $.resize.keepAspect)}
					</label>
					<p className="text-xs text-(--color-secondary)">
						{t(($) => $.resize[resize.keepAspect ? 'fitShort' : 'exactShort'])}
					</p>
				</>
			) : (
				<div className="flex min-w-0 flex-col gap-1">
					<label className="text-sm text-(--color-secondary)" htmlFor="images-percent">
						{t(($) => $.resize.scale)}
					</label>
					<Input
						className="h-8 min-w-0 rounded-lg"
						disabled={busy}
						id="images-percent"
						max={IMAGES.RESIZE.MAX_PERCENT}
						min={IMAGES.RESIZE.MIN_PERCENT}
						step="any"
						type="number"
						value={resize.percent}
						onChange={(event) => setPercent(event.target.value)}
					/>
					<p className="text-xs text-(--color-secondary)">{t(($) => $.resize.percentShort)}</p>
				</div>
			)}
		</>
	);
};

export const ResizeInfo = ({ resize }: { resize: ResizeSettings }) => {
	const { t } = useTranslation('images');

	return (
		<>
			<p>
				{t(
					($) =>
						$.resize[
							resize.unit === 'percent' ? 'percentHint' : resize.keepAspect ? 'fitHint' : 'exactHint'
						]
				)}
			</p>
			<p>{t(($) => $.resize.switchHint)}</p>
			<p>{t(($) => $.resize.limits)}</p>
		</>
	);
};
