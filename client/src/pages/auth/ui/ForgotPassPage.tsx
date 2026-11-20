import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import type { AuthStore } from '@/features/auth';
import { AuthFormHeader, ForgotPassForm } from '@/features/auth';
import type { NotifyStore } from '@/features/notification';
import { usePageTitle } from '@/shared/lib/hooks';

import { AuthWrapper } from './components';

interface ForgotPassPageProps {
	stores: { authStore: AuthStore; notifyStore: NotifyStore };
}

export const ForgotPassPage = (props: ForgotPassPageProps) => {
	const { t } = useTranslation('auth');

	const title = t(($) => $.screens.forgotPass.title);

	usePageTitle(title);

	return (
		<AuthWrapper>
			<AuthFormHeader title={title} />
			<p className="text-justify">{t(($) => $.screens.forgotPass.description)}</p>
			<p className="text-justify text-(--color-disabled)">{t(($) => $.screens.forgotPass.hint)}</p>
			<ForgotPassForm {...props} />
			<Link
				className="cursor-pointer font-semibold text-(--color-tertiary) transition-colors hover:text-(--accent-primary-hover)"
				to="/login"
			>
				{t(($) => $.screens.forgotPass.back)}
			</Link>
		</AuthWrapper>
	);
};
