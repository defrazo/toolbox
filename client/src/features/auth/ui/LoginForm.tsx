import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeClosed, Lock, Mail } from 'lucide-react';
import { observer } from 'mobx-react-lite';

import type { AuthStore } from '@/features/auth';
import type { NotifyStore } from '@/features/notification';
import { Button, Input } from '@/shared/ui';

import { getAuthErrorMessage } from '../lib/utils';
import { useAuth } from '../model';

interface LoginFormProps {
	stores: { authStore: AuthStore; notifyStore: NotifyStore };
}

export const LoginForm = observer(({ stores }: LoginFormProps) => {
	const { t } = useTranslation('auth');
	const navigate = useNavigate();

	const { authStore, notifyStore } = stores;

	const { checkLogin } = useAuth(t, (message) => notifyStore.setNotice(message, 'info'));

	const [login, setLogin] = useState('');
	const [password, setPassword] = useState('');
	const [showPass, setShowPass] = useState(false);

	const PassIcon = showPass ? EyeClosed : Eye;

	const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!checkLogin(login)) return;

		if (!password.trim()) {
			notifyStore.setNotice(
				t(($) => $.errors.empty.password),
				'info'
			);
			return;
		}

		try {
			await authStore.login(login, password);

			notifyStore.setNotice(
				t(($) => $.success.login),
				'success'
			);
		} catch (error: any) {
			const code = error?.response?.data?.code;

			notifyStore.setNotice(
				getAuthErrorMessage(t, code ? code : 'login'),
				code === 'EMAIL_NOT_VERIFIED' ? 'info' : 'error'
			);

			if (code === 'EMAIL_NOT_VERIFIED') {
				sessionStorage.setItem('pendingVerificationEmail', login);
				navigate('/email/verify', { state: { login } });
				return;
			}
		}
	};

	return (
		<form className="flex w-full max-w-md flex-col gap-3" name="login-form" onSubmit={handleSubmit}>
			<Input
				className="border border-(--border-color) bg-(--bg-secondary)/50 pl-11.5 hover:border-(--accent-primary-hover)"
				id="login"
				leftIcon={
					<div className="border-r border-(--border-color)">
						<Mail className="mr-2 ml-1 size-5" />
					</div>
				}
				placeholder={t(($) => $.common.fields.login.placeholder)}
				type="text"
				value={login}
				onChange={(e) => setLogin(e.target.value)}
			/>
			<Input
				className="border border-(--border-color) bg-(--bg-secondary)/50 pl-11.5 hover:border-(--accent-primary-hover)"
				id="password"
				leftIcon={
					<div className="border-r border-(--border-color)">
						<Lock className="mr-2 ml-1 size-5" />
					</div>
				}
				placeholder={t(($) => $.common.fields.password.placeholder)}
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
			<Link className="ml-auto text-sm select-none hover:text-(--accent-primary-hover)" to="/forgot-password">
				{t(($) => $.screens.login.forgotPass)}
			</Link>
			<Button
				className="active-btn mt-4 h-10 w-full bg-(--bg-secondary)"
				loading={authStore.isLoading}
				type="submit"
			>
				{t(($) => $.screens.login.submit)}
			</Button>
		</form>
	);
});
