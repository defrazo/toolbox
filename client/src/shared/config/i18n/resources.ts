import {
	authEn,
	commonEn,
	compareEn,
	homeEn,
	imagesEn,
	linksEn,
	navEn,
	notFoundEn,
	privacyEn,
	renamerEn,
	settingsEn,
	shortenerEn,
} from './locales/en';
import {
	authRu,
	commonRu,
	compareRu,
	homeRu,
	imagesRu,
	linksRu,
	navRu,
	notFoundRu,
	privacyRu,
	renamerRu,
	settingsRu,
	shortenerRu,
} from './locales/ru';

export const defaultNS = 'common';

export const resources = {
	ru: {
		compare: compareRu,
		images: imagesRu,
		auth: authRu,
		common: commonRu,
		home: homeRu,
		links: linksRu,
		nav: navRu,
		notFound: notFoundRu,
		privacy: privacyRu,
		renamer: renamerRu,
		settings: settingsRu,
		shortener: shortenerRu,
	},
	en: {
		compare: compareEn,
		images: imagesEn,
		auth: authEn,
		common: commonEn,
		home: homeEn,
		links: linksEn,
		nav: navEn,
		notFound: notFoundEn,
		privacy: privacyEn,
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
