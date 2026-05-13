import { initReactI18next } from 'react-i18next';
import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import { defaultNS, resources } from './resources';

void i18n
	.use(LanguageDetector)
	.use(initReactI18next)
	.init({
		resources,
		fallbackLng: 'ru',
		defaultNS,
		ns: ['common', 'renamer'],
		supportedLngs: ['ru', 'en'],
		detection: { order: ['localStorage', 'navigator'], caches: ['localStorage'] },
		interpolation: { escapeValue: false },
		react: { useSuspense: false },
	});

export { i18n };
