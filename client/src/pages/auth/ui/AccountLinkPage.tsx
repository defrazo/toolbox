import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import type { AuthStore } from '@/features/auth';
import { AccountLinkForm, AuthFormHeader } from '@/features/auth';
import type { NotifyStore } from '@/features/notification';
import { usePageTitle } from '@/shared/lib/hooks';

import { AuthWrapper } from './components';

interface AccountLinkPageProps {
	stores: { authStore: AuthStore; notifyStore: NotifyStore };
}

export const AccountLinkPage = (props: AccountLinkPageProps) => {
	const { t } = useTranslation('auth');

	const title = t(($) => $.screens.accountLink.title);

	usePageTitle(title);

	return (
		<AuthWrapper>
			<AuthFormHeader title={title} />
			<p className="text-justify">{t(($) => $.screens.accountLink.description)}</p>
			<AccountLinkForm {...props} />
			<Link
				className="cursor-pointer font-semibold text-(--color-tertiary) transition-colors hover:text-(--accent-primary-hover)"
				to="/login"
			>
				{t(($) => $.screens.forgotPass.back)}
			</Link>
		</AuthWrapper>
	);
};
