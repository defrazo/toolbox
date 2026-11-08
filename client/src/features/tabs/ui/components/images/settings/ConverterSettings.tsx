import { useTranslation } from 'react-i18next';

import { SelectExt } from '@/shared/ui';

import { IMAGES, type useImages } from '../../../../model';

type ImagesState = ReturnType<typeof useImages>;

type ConverterSettingsProps = Pick<ImagesState, 'busy' | 'format' | 'setFormat'>;
type ConverterInfoProps = Pick<ImagesState, 'format'>;

export const ConverterSettings = ({ busy, format, setFormat }: ConverterSettingsProps) => {
	const { t } = useTranslation('images');

	return (
		<div className="flex min-w-0 flex-col gap-1">
			<span className="text-sm text-(--color-secondary)">{t(($) => $.output)}</span>
			<SelectExt
				className="h-8 rounded-lg"
				disabled={busy}
				options={IMAGES.CONVERTER.FORMATS.map((value) => ({ value, label: value.toUpperCase() }))}
				value={format}
				onChange={setFormat}
			/>
		</div>
	);
};

export const ConverterInfo = ({ format }: ConverterInfoProps) => {
	const { t } = useTranslation('images');

	return format === 'ico' ? <p>{t(($) => $.converter.icoHint)}</p> : null;
};
