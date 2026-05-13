import { useTranslation } from 'react-i18next';

import { type Language, languageOptions } from '@/shared/config/i18n';
import { Select } from '@/shared/ui';

const LanguageSelect = () => {
	const { i18n } = useTranslation();

	const currentLanguage = i18n.resolvedLanguage as Language;

	const onChangeLanguage = (value: string) => {
		void i18n.changeLanguage(value as Language);
	};

	return (
		<Select
			className="w-36"
			options={languageOptions}
			placeholder="Выберите"
			value={currentLanguage}
			onChange={onChangeLanguage}
		/>
	);
};

export default LanguageSelect;
