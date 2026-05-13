import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { AuthFormHeader, AuthSocial, RegisterForm } from '@/features/auth';
import { usePageTitle } from '@/shared/lib/hooks';
import { AuthDivider } from '@/shared/ui';

export const RegisterPage = () => {
	const { t } = useTranslation('auth');

	usePageTitle(t(($) => $.register.title));

	return (
		<div className="hide-scrollbar relative flex h-full min-h-0 w-full flex-1 cursor-default flex-col gap-4 rounded-r-xl border border-(--border-color) p-3 shadow-(--shadow) md:p-6">
			<div className="core-border m-auto flex w-lg flex-col items-center justify-center gap-4 bg-(--bg-secondary)/50 p-12 text-(--accent-primary-text)">
				<AuthFormHeader title={t(($) => $.register.title)} />
				<AuthSocial type="register" />
				<AuthDivider />
				<RegisterForm />
				<div className="opacity-70 select-none hover:opacity-100">
					{t(($) => $.register.hasAccount)}{' '}
					<Link
						className="cursor-pointer font-semibold text-(--accent-primary) hover:text-(--accent-primary-hover)"
						to="/login"
					>
						{t(($) => $.register.login)}
					</Link>
				</div>
			</div>
			<div className="absolute top-1/2 right-0 size-100 translate-x-1/2 -translate-y-1/2 rounded-full bg-[#7a5cff]/30 blur-[120px]" />
		</div>
	);
};
