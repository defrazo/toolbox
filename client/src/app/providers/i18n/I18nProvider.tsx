import { I18nextProvider } from 'react-i18next';

import { i18n } from '@/shared/config/i18n';

type I18nProviderProps = {
	children: React.ReactNode;
};

const I18nProvider = ({ children }: I18nProviderProps) => {
	return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
};

export default I18nProvider;
