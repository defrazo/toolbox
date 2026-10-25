import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

import { useStore } from '@/app/providers';
import { AuthDemo, AuthFormHeader, AuthOneMate, LoginForm } from '@/features/auth';
import { usePageTitle } from '@/shared/lib/hooks';
import { AuthDivider } from '@/shared/ui';

import { AuthFooterLink, AuthWrapper } from './components';

export const LoginPage = () => {
	const { t } = useTranslation('auth');

	const { notifyStore } = useStore();
	const [searchParams] = useSearchParams();

	const title = t(($) => $.screens.login.title);

	usePageTitle(title);

	useEffect(() => {
		const error = searchParams.get('oauth');
		if (!error) return;

		const url = new URL(window.location.href);
		url.searchParams.delete('oauth');
		window.history.replaceState(window.history.state, '', url);

		const timeout = setTimeout(() => {
			const getMessage = () => {
				switch (error) {
					case 'INVALID_ONEMATE_PROFILE':
						return t(($) => $.errors.oauth.INVALID_ONEMATE_PROFILE);
					case 'invalid_state':
						return t(($) => $.errors.oauth.invalid_state);
					case 'access_denied':
						return t(($) => $.errors.oauth.access_denied);
					case 'invalid_response':
						return t(($) => $.errors.oauth.invalid_response);
					case 'token_error':
						return t(($) => $.errors.oauth.token_error);
					case 'profile_error':
						return t(($) => $.errors.oauth.profile_error);
					case 'connection_error':
						return t(($) => $.errors.oauth.connection_error);
					default:
						return t(($) => $.errors.oauth.default);
				}
			};

			notifyStore.setNotice(getMessage(), error === 'access_denied' ? 'info' : 'error');
		}, 100);

		return () => clearTimeout(timeout);
	}, [searchParams, notifyStore, t]);

	return (
		<AuthWrapper>
			<AuthFormHeader title={title} />
			<div className="flex w-full flex-col gap-3">
				<AuthOneMate />
				<AuthDemo />
			</div>
			<AuthDivider />
			<LoginForm />
			<AuthFooterLink
				linkText={t(($) => $.screens.login.register)}
				text={t(($) => $.screens.login.noAccount)}
				to="/register"
			/>
		</AuthWrapper>
	);
};
