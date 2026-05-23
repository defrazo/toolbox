import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { observer } from 'mobx-react-lite';

import { useStore } from '@/app/providers';
import { cn } from '@/shared/lib/utils';
import { validateEmail } from '@/shared/lib/validators';
import { Button, Input } from '@/shared/ui';

export const ForgotPassForm = observer(() => {
	const { t } = useTranslation('auth');

	const { authStore, notifyStore } = useStore();
	const navigate = useNavigate();

	const [email, setEmail] = useState('');

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		try {
			await validateEmail(email);
			// await authStore.forgotPass(email, password);

			navigate('/');
		} catch (error: any) {
			notifyStore.setNotice(error.message || t(($) => $.forgotPass.error), 'error');
		}
	};

	return (
		<form className="flex w-full max-w-md flex-col gap-4" name="forgot-pass-form" onSubmit={handleSubmit}>
			<Input
				className="border border-(--border-color) bg-(--bg-secondary)/50 pl-11.5 hover:border-(--accent-primary-hover)"
				leftIcon={
					<div className="border-r border-(--border-color)">
						<Mail className="mr-2 ml-1 size-5" />
					</div>
				}
				placeholder={t(($) => $.fields.email.placeholder)}
				value={email}
				onChange={(e) => setEmail(e.target.value)}
			/>
			<Button
				className={cn('mt-4 h-10 w-full bg-(--bg-secondary)', email !== '' && 'active-btn')}
				loading={authStore.isLoading}
				type="submit"
			>
				{t(($) => $.forgotPass.submit)}
			</Button>
		</form>
	);
});
