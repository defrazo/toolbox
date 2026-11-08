import { useTranslation } from 'react-i18next';

import { Input } from '@/shared/ui';

import type { useImages } from '../../../../model';

type ImagesState = ReturnType<typeof useImages>;

type CompressionSettingsProps = Pick<ImagesState, 'busy' | 'quality' | 'setQuality'>;

export const CompressionSettings = ({ busy, quality, setQuality }: CompressionSettingsProps) => {
	const { t } = useTranslation('images');

	return (
		<div className="flex min-w-0 flex-col gap-1">
			<label className="text-sm text-(--color-secondary)" htmlFor="images-quality">
				{t(($) => $.compression.quality)}: {quality}
			</label>
			<Input
				className="h-6 cursor-pointer px-0 accent-(--accent-primary)"
				disabled={busy}
				id="images-quality"
				max={100}
				min={1}
				step={1}
				type="range"
				value={quality}
				variant="custom"
				onChange={(event) => setQuality(Number(event.target.value))}
			/>
			<p className="text-xs text-(--color-secondary)" id="images-quality-hint">
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
