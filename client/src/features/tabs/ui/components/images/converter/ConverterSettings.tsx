import { useTranslation } from 'react-i18next';

import { IMAGE_FORMATS } from '../../../../lib';
import type { useImages } from '../../../../model';
import { Select } from '../Select';

type ImagesState = ReturnType<typeof useImages>;

type ConverterSettingsProps = Pick<ImagesState, 'busy' | 'format' | 'setFormat'>;
type ConverterInfoProps = Pick<ImagesState, 'format'>;

export const ConverterSettings = ({ busy, format, setFormat }: ConverterSettingsProps) => {
	const { t } = useTranslation('images');

	return (
		<>
			<span className="text-sm text-(--color-secondary)">{t(($) => $.output)}</span>
			<Select
				className="min-w-36"
				disabled={busy}
				label={t(($) => $.output)}
				options={IMAGE_FORMATS.map((value) => ({
					value,
					label: value.toUpperCase(),
				}))}
				value={format}
				onChange={setFormat}
			/>
		</>
	);
};

export const ConverterInfo = ({ format }: ConverterInfoProps) => {
	const { t } = useTranslation('images');

	return format === 'ico' ? <p>{t(($) => $.converter.icoHint)}</p> : null;
};
