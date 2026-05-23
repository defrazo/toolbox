import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { AuthFormHeader, ForgotPassForm } from '@/features/auth';
import { usePageTitle } from '@/shared/lib/hooks';

import { AuthWrapper } from './components';

export const ForgotPassPage = () => {
	const { t } = useTranslation('auth');

	const title = t(($) => $.forgotPass.title);

	usePageTitle(title);

	return (
		<AuthWrapper>
			<AuthFormHeader title={title} />
			<p className="text-justify">{t(($) => $.forgotPass.description)}</p>
			<p className="text-justify text-(--color-disabled)">{t(($) => $.forgotPass.hint)}</p>
			<ForgotPassForm />
			<Link
				className="cursor-pointer font-semibold text-(--color-tertiary) transition-colors hover:text-(--accent-primary-hover)"
				to="/login"
			>
				{t(($) => $.forgotPass.back)}
			</Link>
		</AuthWrapper>
	);
};
