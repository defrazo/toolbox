import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Mail } from 'lucide-react';
import { observer } from 'mobx-react-lite';

import { useStore } from '@/app/providers';
import { cn } from '@/shared/lib/utils';
import { validateEmail } from '@/shared/lib/validators';
import { Button, Input } from '@/shared/ui';

export const VerifyEmailForm = observer(() => {
	const { t } = useTranslation('auth');

	const { authStore, notifyStore } = useStore();

	const [email, setEmail] = useState('');

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		try {
			await validateEmail(email);
			// await authStore.verifyEmail(email, password);
		} catch (error: any) {
			notifyStore.setNotice(error.message || t(($) => $.verifyEmail.error), 'error');
		}
	};

	return (
		<form className="flex w-full max-w-md flex-col gap-4" onSubmit={handleSubmit}>
			<Input
				className="border border-(--border-color) bg-(--bg-secondary)/50 pl-11.5 hover:border-(--accent-primary-hover)"
				leftIcon={
					<div className="border-r border-(--border-color)">
						<Mail className="mr-2 ml-1 size-5" />
					</div>
				}
				placeholder={t(($) => $.fields.email.placeholder)}
				value={email}
				onChange={(e) => setEmail(e.target.value.trim())}
			/>

			<Button
				className={cn('mt-4 h-10 w-full', email !== '' && 'active-btn')}
				loading={authStore.isLoading}
				type="submit"
			>
				{t(($) => $.verifyEmail.submit)}
			</Button>
		</form>
	);
});
