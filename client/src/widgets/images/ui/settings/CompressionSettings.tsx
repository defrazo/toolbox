import { useTranslation } from 'react-i18next';
import { Info } from 'lucide-react';

import { Input, Tooltip } from '@/shared/ui';

import type { useImages } from '../../model/useImages';

type ImagesState = ReturnType<typeof useImages>;

interface CompressionSettingsProps extends Pick<ImagesState, 'quality' | 'setQuality'> {
	disabled: boolean;
}

export const CompressionSettings = ({ disabled, quality, setQuality }: CompressionSettingsProps) => {
	const { t } = useTranslation('images');

	return (
		<div className="flex min-w-0 flex-col select-none">
			<div className="flex items-center gap-2 text-(--color-secondary)">
				<span className="text-sm text-(--color-secondary)">
					{t(($) => $.compression.quality)}: {quality}
				</span>
				<Tooltip content={t(($) => $.compression.shortHint)}>
					<Info className="size-4" />
				</Tooltip>
			</div>
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
				wheelStep
				onChange={(event) => setQuality(Number(event.target.value))}
			/>
		</div>
	);
};

export const CompressionInfo = () => {
	const { t } = useTranslation('images');

	return (
		<>
			<span>{t(($) => $.compression.qualityHint)}</span>
			<span>{t(($) => $.compression.pngHint)}</span>
		</>
	);
};
