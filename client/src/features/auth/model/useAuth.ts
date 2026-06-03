import type { TFunction } from 'i18next';

import { useStore } from '@/app/providers';
import { validateEmail, validateInvite, validatePassword, validateUsername } from '@/shared/lib/validators';

export const useAuth = (t: TFunction<'auth'>) => {
	const { notifyStore } = useStore();

	const notify = (msg: string) => notifyStore.setNotice(msg, 'info');

	const checkUsername = (value: string) => {
		const result = validateUsername(value);

		if (result === 'empty') {
			notify(t(($) => $.errors.empty.username));
			return false;
		}

		if (result === 'invalid') {
			notify(t(($) => $.errors.invalid.username));
			return false;
		}

		return true;
	};

	const checkEmail = (value: string) => {
		const result = validateEmail(value);

		if (result === 'empty') {
			notify(t(($) => $.errors.empty.email));
			return false;
		}

		if (result === 'invalid') {
			notify(t(($) => $.errors.invalid.email));
			return false;
		}

		return true;
	};

	const checkPassword = (value: string) => {
		const result = validatePassword(value);

		if (result === 'empty') {
			notify(t(($) => $.errors.empty.password));
			return false;
		}

		if (result === 'invalid') {
			notify(t(($) => $.errors.invalid.password));
			return false;
		}

		return true;
	};

	const checkInvite = (value: string) => {
		const result = validateInvite(value);

		if (result === 'empty') {
			notify(t(($) => $.errors.empty.invite));
			return false;
		}

		if (result === 'invalid') {
			notify(t(($) => $.errors.invalid.invite));
			return false;
		}

		return true;
	};

	return { checkUsername, checkEmail, checkPassword, checkInvite };
};
