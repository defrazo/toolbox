import { useTranslation } from 'react-i18next';
import { Info, Pipette } from 'lucide-react';

import { cn } from '@/shared/lib/utils';
import { Button, Input, Tooltip } from '@/shared/ui';

import { type BackgroundSettings, type ImageFile, IMAGES, type useImages } from '../../../../model';

type BackgroundControlsProps = Pick<ReturnType<typeof useImages>, 'setBackground' | 'format' | 'setFormat' | 'busy'> & {
	file?: ImageFile;
	color: string | null;
	picking: boolean;
	zoom: number;
	onPick: () => void;
	onZoomChange: (value: number) => void;
};

export const BackgroundControls = ({
	file,
	color,
	picking,
	onPick,
	setBackground,
	format,
	setFormat,
	busy,
	zoom,
	onZoomChange,
}: BackgroundControlsProps) => {
	const { t } = useTranslation('images');

	const background = file?.background ?? IMAGES.BACKGROUND.DEFAULT;
	const disabled = busy || !file?.format;

	const update = (value: BackgroundSettings) => {
		if (file) setBackground(file.id, value);
	};

	return (
		<div className="flex min-w-0 flex-col gap-3">
			<div className="flex min-w-0 flex-col gap-1.5">
				<div className="flex items-center gap-2 text-(--color-secondary) select-none">
					<span className="text-sm">{t(($) => $.background.color)}</span>
					<Tooltip content={picking ? t(($) => $.background.pickingHint) : t(($) => $.background.pickHint)}>
						<Info className="size-4" />
					</Tooltip>
				</div>
				<div className="flex min-w-0 items-center gap-2">
					<span
						className="size-8 shrink-0 rounded-lg border border-(--border-color) bg-(--bg-tertiary)"
						style={color ? { backgroundColor: color } : undefined}
					/>
					<output className="min-w-0 flex-1 font-mono text-sm text-(--color-secondary)">
						{color ?? '—'}
					</output>
					<Button
						aria-controls="background-preview"
						aria-pressed={picking}
						className={picking ? 'active-btn' : ''}
						disabled={busy || (!picking && (disabled || !color))}
						leftIcon={<Pipette className="size-4" />}
						size="sm"
						onClick={onPick}
					>
						{t(($) => $.background.eyedropper)}
					</Button>
				</div>
			</div>
			<div className="flex flex-col gap-1.5">
				<div className="flex items-center gap-2 text-(--color-secondary) select-none">
					<span className="text-sm text-(--color-secondary) select-none">
						{t(($) => $.crop.zoom)}: {zoom}%
					</span>
					<Tooltip content={t(($) => $.background.previewHint)}>
						<Info className="size-4" />
					</Tooltip>
				</div>
				<Input
					className="h-6 px-0 accent-(--accent-primary)"
					disabled={disabled}
					id="background-zoom"
					max={400}
					min={25}
					step={5}
					type="range"
					value={zoom}
					variant="custom"
					onChange={(event) => onZoomChange(Number(event.target.value))}
				/>
			</div>
			<div className="flex items-center gap-2">
				{(['contiguous', 'global'] as const).map((mode) => (
					<Button
						key={mode}
						aria-pressed={background.mode === mode}
						className={cn('h-8 flex-1 rounded-lg', background.mode === mode ? 'active-btn' : '')}
						disabled={disabled}
						size="sm"
						onClick={() => update({ ...background, mode })}
					>
						{t(($) => $.background.modes[mode])}
					</Button>
				))}
			</div>
			{(['tolerance', 'feather'] as const).map((setting) => (
				<div key={setting} className="flex flex-col gap-1.5">
					<span className="text-sm text-(--color-secondary) select-none">
						{t(($) => $.background[setting])}: {background[setting]}
					</span>
					<Input
						className="h-6 cursor-pointer px-0 accent-(--accent-primary)"
						disabled={disabled}
						id={`background-${setting}`}
						max={setting === 'tolerance' ? 100 : 10}
						min={0}
						step={1}
						type="range"
						value={background[setting]}
						variant="custom"
						onChange={(event) => update({ ...background, [setting]: Number(event.target.value) })}
					/>
				</div>
			))}
			<div className="flex min-w-0 flex-col gap-1.5">
				<div className="flex items-center gap-2 text-(--color-secondary)">
					<span className="text-sm select-none">{t(($) => $.output)}</span>
					<Tooltip content={t(($) => $.background.shortHint)}>
						<Info className="size-4" />
					</Tooltip>
				</div>
				<div className="flex items-center gap-2">
					{(['png', 'webp'] as const).map((value) => (
						<Button
							key={value}
							aria-pressed={format === value}
							className={cn('h-8 flex-1 rounded-lg', format === value ? 'active-btn flex-1' : 'flex-1')}
							disabled={disabled}
							size="sm"
							onClick={() => setFormat(value)}
						>
							{value.toUpperCase()}
						</Button>
					))}
				</div>
			</div>
		</div>
	);
};

export const BackgroundInfo = () => {
	const { t } = useTranslation('images');

	return <span>{t(($) => $.background.hint)}</span>;
};
