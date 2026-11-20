import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';

import type { AuthStore } from '@/features/auth';
import { AuthFormHeader, ResetPassForm } from '@/features/auth';
import type { NotifyStore } from '@/features/notification';
import { usePageTitle } from '@/shared/lib/hooks';
import { Button } from '@/shared/ui';

import { AuthWrapper } from './components';

interface ResetPassPageProps {
	stores: { authStore: AuthStore; notifyStore: NotifyStore };
}

export const ResetPassPage = (props: ResetPassPageProps) => {
	const { t } = useTranslation('auth');
	const navigate = useNavigate();

	const [searchParams] = useSearchParams();

	const token = searchParams.get('token');
	const email = searchParams.get('email');

	const isValidResetLink = token !== null && email !== null;

	const title = t(($) => $.screens.resetPass.title);

	usePageTitle(title);

	return (
		<AuthWrapper>
			<AuthFormHeader title={title} />
			{isValidResetLink ? (
				<>
					<h2 className="text-(--color-secondary)">{t(($) => $.screens.resetPass.subtitle)}</h2>
					<ResetPassForm {...props} email={email} token={token} />
				</>
			) : (
				<div className="flex flex-col gap-4">
					<p className="text-(--color-secondary)">{t(($) => $.screens.resetPass.subtitleExpired)}</p>
					<Button className="active-btn" onClick={() => navigate('/forgot-password')}>
						{t(($) => $.screens.resetPass.submitExpired)}
					</Button>
				</div>
			)}
		</AuthWrapper>
	);
};
