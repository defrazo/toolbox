import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import type { AuthStore } from '@/features/auth';
import { AuthFormHeader, AuthOneMate, RegisterForm } from '@/features/auth';
import type { NotifyStore } from '@/features/notification';
import { usePageTitle } from '@/shared/lib/hooks';
import { AuthDivider } from '@/shared/ui';

import { AuthFooterLink, AuthWrapper, PrivacyConsent } from './components';

interface RegisterPageProps {
	stores: { authStore: AuthStore; notifyStore: NotifyStore };
}

export const RegisterPage = ({ stores }: RegisterPageProps) => {
	const { t } = useTranslation('auth');

	const { authStore } = stores;

	const [isPrivacyAccepted, setIsPrivacyAccepted] = useState(false);

	const title = t(($) => $.screens.register.title);

	usePageTitle(title);

	return (
		<AuthWrapper>
			<AuthFormHeader title={title} />
			<AuthOneMate stores={{ authStore: authStore }} />
			<AuthDivider />
			<RegisterForm isPrivacyAccepted={isPrivacyAccepted} stores={stores} />
			<PrivacyConsent checked={isPrivacyAccepted} onChange={setIsPrivacyAccepted} />
			<AuthFooterLink
				linkText={t(($) => $.screens.register.login)}
				text={t(($) => $.screens.register.hasAccount)}
				to="/login"
			/>
		</AuthWrapper>
	);
};
