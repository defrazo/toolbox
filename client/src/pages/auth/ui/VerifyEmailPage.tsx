import { useTranslation } from 'react-i18next';

import { AuthFormHeader, VerifyEmailForm } from '@/features/auth';
import { usePageTitle } from '@/shared/lib/hooks';

import { AuthWrapper } from './components';

export const VerifyEmailPage = () => {
	const { t } = useTranslation('auth');

	const title = t(($) => $.verifyEmail.title);

	usePageTitle(title);

	return (
		<AuthWrapper>
			<AuthFormHeader title={title} />
			<p className="text-justify">{t(($) => $.verifyEmail.description)}</p>
			<p className="text-justify text-(--color-disabled)">{t(($) => $.verifyEmail.hint)}</p>
			<VerifyEmailForm />
		</AuthWrapper>
	);
};
