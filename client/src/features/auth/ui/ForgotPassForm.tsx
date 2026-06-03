import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { observer } from 'mobx-react-lite';

import { useStore } from '@/app/providers';
import { Button, Input } from '@/shared/ui';

import { useAuth } from '../model';

export const ForgotPassForm = observer(() => {
	const { t } = useTranslation('auth');
	const navigate = useNavigate();

	const { authStore, notifyStore } = useStore();
	const { checkEmail } = useAuth(t);

	const [email, setEmail] = useState('');

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!checkEmail(email)) return;

		try {
			await authStore.forgotPassword(email);

			notifyStore.setNotice(
				t(($) => $.success.forgotPass),
				'success'
			);

			navigate('/login');
		} catch {
			notifyStore.setNotice(
				t(($) => $.errors.default),
				'error'
			);
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
				placeholder={t(($) => $.common.fields.email.placeholder)}
				type="email"
				value={email}
				onChange={(e) => setEmail(e.target.value)}
			/>
			<Button
				className="active-btn mt-4 h-10 w-full bg-(--bg-secondary)"
				loading={authStore.isLoading}
				type="submit"
			>
				{t(($) => $.screens.forgotPass.submit)}
			</Button>
		</form>
	);
});
