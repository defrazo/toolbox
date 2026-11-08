import { useTranslation } from 'react-i18next';
import { Check } from 'lucide-react';

import { cn } from '@/shared/lib/utils';
import { Button, Input } from '@/shared/ui';

import { IMAGES, type ResizeSettings } from '../../../../model';

interface ResizeControlsProps {
	resize: ResizeSettings;
	disabled: boolean;
	setSide: (side: 'width' | 'height', value: string) => void;
	setUnit: (unit: ResizeSettings['unit']) => void;
	setPercent: (value: string) => void;
	setAspect: (value: boolean) => void;
}

export const ResizeControls = ({ resize, disabled, setSide, setUnit, setPercent, setAspect }: ResizeControlsProps) => {
	const { t } = useTranslation('images');

	return (
		<div className="flex min-w-0 flex-col gap-3">
			<div className="flex flex-col gap-1.5">
				<span className="text-sm text-(--color-secondary) select-none">{t(($) => $.resize.mode)}</span>
				<div aria-label={t(($) => $.resize.scale)} className="flex" role="group">
					{(['pixels', 'percent'] as const).map((unit) => (
						<Button
							key={unit}
							aria-pressed={resize.unit === unit}
							className={cn(
								'h-8 flex-1 rounded-lg first:rounded-r-none last:rounded-l-none',
								resize.unit === unit && 'active-btn'
							)}
							disabled={disabled}
							onClick={() => setUnit(unit)}
						>
							{t(($) => $.resize[unit])}
						</Button>
					))}
				</div>
			</div>
			{resize.unit === 'pixels' ? (
				<>
					<div className="grid grid-cols-2 gap-2">
						{(['width', 'height'] as const).map((side) => (
							<div key={side} className="flex min-w-0 flex-col gap-1">
								<label
									className="text-sm text-(--color-secondary) select-none"
									htmlFor={`images-${side}`}
								>
									{t(($) => $.resize[side])}
								</label>
								<Input
									className="h-8 min-w-0 rounded-lg"
									disabled={disabled}
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
					<div className="flex min-w-0 flex-col gap-1.5 select-none">
						<label
							className={cn(
								'flex w-fit items-center gap-2 text-sm text-(--color-secondary)',
								disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
							)}
						>
							<input
								checked={resize.keepAspect}
								className="peer sr-only"
								disabled={disabled}
								type="checkbox"
								onChange={(event) => setAspect(event.target.checked)}
							/>
							<span
								aria-hidden="true"
								className={cn(
									'flex size-4 shrink-0 items-center justify-center rounded-sm border transition-colors',
									'peer-focus-visible:ring-2 peer-focus-visible:ring-(--accent-primary)',
									resize.keepAspect
										? 'border-transparent bg-(--accent-primary) text-white'
										: 'border-(--border-color) bg-(--bg-tertiary)'
								)}
							>
								{resize.keepAspect && <Check size={10} strokeWidth={3} />}
							</span>
							{t(($) => $.resize.keepAspect)}
						</label>
						<span className="text-xs text-(--color-secondary)">
							{t(($) => $.resize[resize.keepAspect ? 'fitShort' : 'exactShort'])}
						</span>
					</div>
				</>
			) : (
				<div className="flex min-w-0 flex-col gap-1.5">
					<label className="text-sm text-(--color-secondary) select-none" htmlFor="images-percent">
						{t(($) => $.resize.scale)}
					</label>
					<Input
						className="h-8 min-w-0 rounded-lg"
						disabled={disabled}
						id="images-percent"
						max={IMAGES.RESIZE.MAX_PERCENT}
						min={IMAGES.RESIZE.MIN_PERCENT}
						step="any"
						type="number"
						value={resize.percent}
						onChange={(event) => setPercent(event.target.value)}
					/>
					<span className="text-xs text-(--color-secondary) select-none">
						{t(($) => $.resize.percentShort)}
					</span>
				</div>
			)}
		</div>
	);
};

export const ResizeInfo = ({ resize }: { resize: ResizeSettings }) => {
	const { t } = useTranslation('images');

	return (
		<>
			<span>
				{t(
					($) =>
						$.resize[
							resize.unit === 'percent' ? 'percentHint' : resize.keepAspect ? 'fitHint' : 'exactHint'
						]
				)}
			</span>
			<span>{t(($) => $.resize.switchHint)}</span>
			<span>{t(($) => $.resize.limits)}</span>
		</>
	);
};
