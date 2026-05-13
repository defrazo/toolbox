import { useTranslation } from 'react-i18next';

import { AuthFormHeader, ResetPassForm } from '@/features/auth';
import { usePageTitle } from '@/shared/lib/hooks';

export const ResetPassPage = () => {
	const { t } = useTranslation('auth');

	usePageTitle(t(($) => $.resetPass.title));

	return (
		<div className="hide-scrollbar relative flex h-full min-h-0 w-full flex-1 cursor-default flex-col gap-4 rounded-r-xl border border-(--border-color) p-3 shadow-(--shadow) md:p-6">
			<div className="core-border m-auto flex w-lg flex-col items-center justify-center gap-4 bg-(--bg-secondary)/50 p-12 text-(--accent-primary-text)">
				<AuthFormHeader title={t(($) => $.resetPass.title)} />
				<h2>{t(($) => $.resetPass.subtitle)}</h2>
				<ResetPassForm />
			</div>
			<div className="absolute top-1/2 right-0 size-100 translate-x-1/2 -translate-y-1/2 rounded-full bg-[#7a5cff]/30 blur-[120px]" />
		</div>
	);
};
