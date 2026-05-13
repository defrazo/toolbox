import { authEn, commonEn, helpEn, homeEn, navEn, renamerEn, settingsEn, shortenerEn } from './locales/en';
import { authRu, commonRu, helpRu, homeRu, navRu, renamerRu, settingsRu, shortenerRu } from './locales/ru';

export const defaultNS = 'common';

export const resources = {
	ru: {
		auth: authRu,
		common: commonRu,
		help: helpRu,
		home: homeRu,
		nav: navRu,
		renamer: renamerRu,
		settings: settingsRu,
		shortener: shortenerRu,
	},
	en: {
		auth: authEn,
		common: commonEn,
		help: helpEn,
		home: homeEn,
		nav: navEn,
		renamer: renamerEn,
		settings: settingsEn,
		shortener: shortenerEn,
	},
};

export const languageOptions = [
	{ value: 'ru', label: 'Русский' },
	{ value: 'en', label: 'English' },
];

export type Language = (typeof languageOptions)[number]['value'];
