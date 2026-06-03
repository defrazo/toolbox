import { useTranslation } from 'react-i18next';

import { type Language, languageOptions } from '@/shared/config/i18n';
import { SelectExt } from '@/shared/ui';

export const LanguageSelect = ({ className }: { className?: string }) => {
	const { i18n } = useTranslation();

	const currentLanguage = i18n.resolvedLanguage as Language;

	const onChangeLanguage = (value: string) => {
		void i18n.changeLanguage(value as Language);
	};

	return (
		<SelectExt
			className={className}
			options={languageOptions}
			value={currentLanguage}
			onChange={onChangeLanguage}
		/>
	);
};
