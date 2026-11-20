import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import type { UserStore } from '@/entities/user';
import type { AuthStore } from '@/features/auth';
import { AuthFormHeader, ResendEmailForm } from '@/features/auth';
import type { NotifyStore } from '@/features/notification';
import { usePageTitle } from '@/shared/lib/hooks';

import { AuthWrapper } from './components';

interface ResendEmailPageProps {
	stores: { authStore: AuthStore; notifyStore: NotifyStore; userStore: UserStore };
}

export const ResendEmailPage = observer(({ stores }: ResendEmailPageProps) => {
	const { t } = useTranslation('auth');

	const { authStore } = stores;

	const title = t(($) => $.screens.resendEmail.title);

	usePageTitle(title);

	return (
		<AuthWrapper>
			<AuthFormHeader title={title} />
			<p className="text-justify">{t(($) => $.screens.resendEmail.description)}</p>
			<p className="text-justify text-(--color-disabled)">{t(($) => $.screens.resendEmail.hint)}</p>
			<ResendEmailForm stores={stores} />
			<Link
				className="cursor-pointer font-semibold text-(--color-tertiary) transition-colors hover:text-(--accent-primary-hover)"
				to={authStore.isAuth ? '/?tab=settings' : '/login'}
			>
				{t(($) => $.screens.resendEmail.back)}
			</Link>
		</AuthWrapper>
	);
});
