import { useTranslation } from 'react-i18next';

import { AuthFormHeader, AuthSocial, LoginForm } from '@/features/auth';
import { usePageTitle } from '@/shared/lib/hooks';
import { AuthDivider } from '@/shared/ui';

import { AuthFooterLink, AuthWrapper } from './components';

export const LoginPage = () => {
	const { t } = useTranslation('auth');

	const title = t(($) => $.login.title);

	usePageTitle(title);

	return (
		<AuthWrapper>
			<AuthFormHeader title={title} />
			<AuthSocial type="login" />
			<AuthDivider />
			<LoginForm />
			<AuthFooterLink linkText={t(($) => $.login.register)} text={t(($) => $.login.noAccount)} to="/register" />
		</AuthWrapper>
	);
};
