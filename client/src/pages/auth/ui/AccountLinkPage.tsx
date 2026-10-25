import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { AccountLinkForm, AuthFormHeader } from '@/features/auth';
import { usePageTitle } from '@/shared/lib/hooks';

import { AuthWrapper } from './components';

export const AccountLinkPage = () => {
	const { t } = useTranslation('auth');

	const title = t(($) => $.screens.accountLink.title);

	usePageTitle(title);

	return (
		<AuthWrapper>
			<AuthFormHeader title={title} />
			<p className="text-justify">{t(($) => $.screens.accountLink.description)}</p>
			<AccountLinkForm />
			<Link
				className="cursor-pointer font-semibold text-(--color-tertiary) transition-colors hover:text-(--accent-primary-hover)"
				to="/login"
			>
				{t(($) => $.screens.forgotPass.back)}
			</Link>
		</AuthWrapper>
	);
};
