import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Eye, EyeClosed, Lock } from 'lucide-react';
import { observer } from 'mobx-react-lite';

import { useStore } from '@/app/providers';
import { Button, Input } from '@/shared/ui';

export const AccountLinkForm = observer(() => {
	const navigate = useNavigate();
	const { t } = useTranslation('auth');

	const { authStore, notifyStore } = useStore();

	const [password, setPassword] = useState('');
	const [showPass, setShowPass] = useState(false);

	const PassIcon = showPass ? EyeClosed : Eye;

	const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (authStore.isLoading) return;

		if (!password.trim()) {
			notifyStore.setNotice(
				t(($) => $.errors.empty.password),
				'info'
			);
			return;
		}

		try {
			await authStore.confirmOneMateLink(password);

			notifyStore.setNotice(
				t(($) => $.success.accountLink),
				'success'
			);
		} catch (error: unknown) {
			const code = axios.isAxiosError<{ code?: string }>(error) ? error.response?.data?.code : undefined;

			if (code === 'LINK_EXPIRED') {
				notifyStore.setNotice(
					t(($) => $.errors.oauth.LINK_EXPIRED),
					'info'
				);
				navigate('/login', { replace: true });
				return;
			}

			notifyStore.setNotice(
				code === 'INVALID_PASSWORD'
					? t(($) => $.errors.oauth.INVALID_PASSWORD)
					: t(($) => $.errors.oauth.linkFailed),
				'error'
			);
		}
	};

	return (
		<form className="flex w-full max-w-md flex-col gap-3" name="account-link-form" onSubmit={handleSubmit}>
			<Input
				className="border border-(--border-color) bg-(--bg-secondary)/50 pl-11.5 hover:border-(--accent-primary-hover)"
				id="password"
				leftIcon={
					<div className="border-r border-(--border-color)">
						<Lock className="mr-2 ml-1 size-5" />
					</div>
				}
				placeholder={t(($) => $.screens.accountLink.passwordPlaceholder)}
				rightIcon={
					<PassIcon
						className="mr-1 ml-2 size-5 cursor-pointer hover:text-(--accent-primary-hover)"
						onClick={() => setShowPass((prev) => !prev)}
					/>
				}
				type={showPass ? 'text' : 'password'}
				value={password}
				onChange={(e) => setPassword(e.target.value)}
			/>
			<Button
				className="active-btn mt-4 h-10 w-full bg-(--bg-secondary)"
				loading={authStore.isLoading}
				type="submit"
			>
				{t(($) => $.screens.accountLink.submit)}
			</Button>
		</form>
	);
});
