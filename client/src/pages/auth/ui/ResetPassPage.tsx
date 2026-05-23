import { useTranslation } from 'react-i18next';

import { AuthFormHeader, ResetPassForm } from '@/features/auth';
import { usePageTitle } from '@/shared/lib/hooks';

import { AuthWrapper } from './components';

export const ResetPassPage = () => {
	const { t } = useTranslation('auth');

	const title = t(($) => $.resetPass.title);

	usePageTitle(title);

	return (
		<AuthWrapper>
			<AuthFormHeader title={title} />
			<h2 className="text-(--color-secondary)">{t(($) => $.resetPass.subtitle)}</h2>
			<ResetPassForm />
		</AuthWrapper>
	);
};
