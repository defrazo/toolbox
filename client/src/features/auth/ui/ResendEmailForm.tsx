import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { observer } from 'mobx-react-lite';

import type { UserStore } from '@/entities/user';
import { resendPendingEmail } from '@/entities/user';
import type { AuthStore } from '@/features/auth';
import type { NotifyStore } from '@/features/notification';
import { Button, Input } from '@/shared/ui';

import { emailCooldown, useAuth } from '../model';

interface ResendEmailFormProps {
	stores: { authStore: AuthStore; notifyStore: NotifyStore; userStore: UserStore };
}

export const ResendEmailForm = observer(({ stores }: ResendEmailFormProps) => {
	const { t } = useTranslation('auth');

	const { authStore, notifyStore, userStore } = stores;

	const location = useLocation();

	const { checkEmail } = useAuth(t, (message) => notifyStore.setNotice(message, 'info'));

	const locationState = location.state as { email?: string } | null;

	const initialEmail =
		userStore.pendingEmail ?? locationState?.email ?? sessionStorage.getItem('pendingVerificationEmail') ?? '';

	const [email, setEmail] = useState(initialEmail);
	const [cooldown, setCooldown] = useState(emailCooldown.getRemaining());

	const isCooldown = cooldown > 0;

	const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!checkEmail(email)) return;

		try {
			userStore.pendingEmail ? await resendPendingEmail() : await authStore.resendVerificationEmail(email);

			emailCooldown.start();
			setCooldown(emailCooldown.getRemaining());

			notifyStore.setNotice(
				t(($) => $.success.resendEmail),
				'success'
			);
		} catch {
			notifyStore.setNotice(
				t(($) => $.errors.default),
				'error'
			);
		}
	};

	useEffect(() => {
		if (cooldown <= 0) return;

		const timerId = window.setInterval(() => setCooldown(emailCooldown.getRemaining()), 1000);

		return () => window.clearInterval(timerId);
	}, [cooldown]);

	return (
		<form className="flex w-full max-w-md flex-col gap-3" name="resend-email-form" onSubmit={handleSubmit}>
			<Input
				className="border border-(--border-color) bg-(--bg-secondary)/50 pl-11.5 hover:border-(--accent-primary-hover)"
				disabled={isCooldown}
				id="email"
				leftIcon={
					<div className="border-r border-(--border-color)">
						<Mail className="mr-2 ml-1 size-5" />
					</div>
				}
				placeholder={t(($) => $.common.fields.email.placeholder)}
				type="email"
				value={email}
				onChange={(e) => setEmail(e.target.value)}
			/>
			<Button
				className="active-btn mt-4 h-10 w-full bg-(--bg-secondary)"
				disabled={isCooldown}
				loading={authStore.isLoading}
				type="submit"
			>
				{isCooldown
					? t(($) => $.screens.resendEmail.cooldown, { seconds: cooldown })
					: t(($) => $.screens.resendEmail.submit)}
			</Button>
		</form>
	);
});
