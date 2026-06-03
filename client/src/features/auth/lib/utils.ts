import type { TFunction } from 'i18next';

export const getAuthErrorMessage = (t: TFunction<'auth'>, code?: string) => {
	switch (code) {
		case 'INVALID_CREDENTIALS':
			return t(($) => $.errors.invalid.credentials);
		case 'INVALID_USERNAME':
			return t(($) => $.errors.invalid.username);
		case 'INVALID_EMAIL':
			return t(($) => $.errors.invalid.email);
		case 'INVALID_PASSWORD':
			return t(($) => $.errors.invalid.password);
		case 'INVALID_CURRENT_PASSWORD':
			return t(($) => $.errors.invalid.currentPassword);
		case 'INVALID_INVITE':
			return t(($) => $.errors.invalid.invite);
		case 'EMAIL_TAKEN':
			return t(($) => $.errors.email.taken);
		case 'EMAIL_NOT_VERIFIED':
			return t(($) => $.errors.email.notVerified);
		case 'REGISTRATION_ERROR':
			return t(($) => $.errors.default);
		case 'LOGIN_ERROR':
			return t(($) => $.errors.default);
		case 'PASSWORD_UPDATE_ERROR':
			return t(($) => $.errors.default);
		case 'DEMO_RESTRICTED':
			return t(($) => $.errors.demo);
		default:
			return t(($) => $.errors.default);
	}
};
