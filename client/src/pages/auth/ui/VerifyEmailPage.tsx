import { useTranslation } from 'react-i18next';

import type { UserStore } from '@/entities/user';
import type { AuthStore } from '@/features/auth';
import { VerifyEmailForm } from '@/features/auth';
import { usePageTitle } from '@/shared/lib/hooks';

import { AuthWrapper } from './components';

interface VerifyEmailPageProps {
	stores: { authStore: AuthStore; userStore: UserStore };
}

export const VerifyEmailPage = (props: VerifyEmailPageProps) => {
	const { t } = useTranslation('auth');

	usePageTitle(t(($) => $.screens.verifyEmail.title));

	return (
		<AuthWrapper>
			<VerifyEmailForm {...props} />
		</AuthWrapper>
	);
};
