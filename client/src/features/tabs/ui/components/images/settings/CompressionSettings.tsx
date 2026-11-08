import { useTranslation } from 'react-i18next';

import { Input } from '@/shared/ui';

import type { useImages } from '../../../../model';

type ImagesState = ReturnType<typeof useImages>;

interface CompressionSettingsProps extends Pick<ImagesState, 'quality' | 'setQuality'> {
	disabled: boolean;
}

export const CompressionSettings = ({ disabled, quality, setQuality }: CompressionSettingsProps) => {
	const { t } = useTranslation('images');

	return (
		<div className="flex min-w-0 flex-col gap-1">
			<span className="text-sm text-(--color-secondary) select-none">
				{t(($) => $.compression.quality)}: {quality}
			</span>
			<Input
				className="h-6 cursor-pointer px-0 accent-(--accent-primary)"
				disabled={disabled}
				id="images-quality"
				max={100}
				min={1}
				step={1}
				type="range"
				value={quality}
				variant="custom"
				onChange={(event) => setQuality(Number(event.target.value))}
			/>
			<p className="text-xs text-(--color-secondary) select-none" id="images-quality-hint">
				{t(($) => $.compression.shortHint)}
			</p>
		</div>
	);
};

export const CompressionInfo = () => {
	const { t } = useTranslation('images');

	return (
		<>
			<p>{t(($) => $.compression.qualityHint)}</p>
			<p>{t(($) => $.compression.pngHint)}</p>
		</>
	);
};
