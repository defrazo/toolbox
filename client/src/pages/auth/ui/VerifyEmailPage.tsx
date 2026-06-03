import { useTranslation } from 'react-i18next';

import { VerifyEmailForm } from '@/features/auth';
import { usePageTitle } from '@/shared/lib/hooks';

import { AuthWrapper } from './components';

export const VerifyEmailPage = () => {
	const { t } = useTranslation('auth');

	usePageTitle(t(($) => $.screens.verifyEmail.title));

	return (
		<AuthWrapper>
			<VerifyEmailForm />
		</AuthWrapper>
	);
};
