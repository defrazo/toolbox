import { useTranslation } from 'react-i18next';

import { AuthFormHeader, AuthSocial, RegisterForm } from '@/features/auth';
import { usePageTitle } from '@/shared/lib/hooks';
import { AuthDivider } from '@/shared/ui';

import { AuthFooterLink, AuthWrapper } from './components';

export const RegisterPage = () => {
	const { t } = useTranslation('auth');

	const title = t(($) => $.register.title);

	usePageTitle(title);

	return (
		<AuthWrapper>
			<AuthFormHeader title={title} />
			<AuthSocial type="register" />
			<AuthDivider />
			<RegisterForm />
			<AuthFooterLink linkText={t(($) => $.register.login)} text={t(($) => $.register.hasAccount)} to="/login" />
		</AuthWrapper>
	);
};
