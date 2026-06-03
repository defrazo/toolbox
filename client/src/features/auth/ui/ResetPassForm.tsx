import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeClosed, Lock } from 'lucide-react';
import { observer } from 'mobx-react-lite';

import { useStore } from '@/app/providers';
import { Button, Input } from '@/shared/ui';

import { getAuthErrorMessage } from '../lib';
import { useAuth } from '../model';
import { PasswordHint } from '.';

export const ResetPassForm = observer(({ email, token }: { email: string; token: string }) => {
	const { t } = useTranslation('auth');
	const navigate = useNavigate();

	const { authStore, notifyStore } = useStore();
	const { checkPassword } = useAuth(t);

	const [password, setPassword] = useState('');
	const [passConfirm, setPassConfirm] = useState('');

	const [showPassword, setShowPassword] = useState(false);
	const [showHint, setShowHint] = useState(false);

	const PassIcon = showPassword ? EyeClosed : Eye;

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!checkPassword(password)) return;

		if (password !== passConfirm) {
			notifyStore.setNotice(
				t(($) => $.errors.invalid.passwordMismatch),
				'info'
			);
			return;
		}

		try {
			await authStore.resetPassword(email, token, password, passConfirm);

			notifyStore.setNotice(
				t(($) => $.success.resetPass),
				'success'
			);

			navigate('/login');
		} catch (error: any) {
			const code = error?.response?.data?.code;
			notifyStore.setNotice(getAuthErrorMessage(t, code), 'error');
		}
	};

	return (
		<form className="flex w-full max-w-md flex-col gap-4" name="reset-pass-form" onSubmit={handleSubmit}>
			<div className="relative">
				<Input
					className="border border-(--border-color) bg-(--bg-secondary)/50 pl-11.5 hover:border-(--accent-primary-hover)"
					disabled={authStore.isLoading}
					leftIcon={
						<div className="border-r border-(--border-color)">
							<Lock className="mr-2 ml-1 size-5" />
						</div>
					}
					placeholder={t(($) => $.common.fields.password.placeholder)}
					rightIcon={
						<PassIcon
							className="mr-1 ml-2 size-5 cursor-pointer hover:text-(--accent-primary-hover)"
							onClick={() => setShowPassword((prev) => !prev)}
						/>
					}
					type={showPassword ? 'text' : 'password'}
					value={password}
					onBlur={() => setShowHint(false)}
					onChange={(e) => setPassword(e.target.value)}
					onFocus={() => setShowHint(true)}
				/>
				<PasswordHint password={password} showHint={showHint} />
			</div>
			<Input
				className="border border-(--border-color) bg-(--bg-secondary)/50 pl-11.5 hover:border-(--accent-primary-hover)"
				disabled={authStore.isLoading}
				leftIcon={
					<div className="border-r border-(--border-color)">
						<Lock className="mr-2 ml-1 size-5" />
					</div>
				}
				placeholder={t(($) => $.common.fields.passConfirm.placeholder)}
				rightIcon={
					<PassIcon
						className="mr-1 ml-2 size-5 cursor-pointer hover:text-(--accent-primary-hover)"
						onClick={() => setShowPassword((prev) => !prev)}
					/>
				}
				type={showPassword ? 'text' : 'password'}
				value={passConfirm}
				onChange={(e) => setPassConfirm(e.target.value)}
			/>
			<Button
				className="active-btn mt-4 h-10 w-full bg-(--bg-secondary)"
				disabled={authStore.isLoading}
				loading={authStore.isLoading}
				type="submit"
			>
				{t(($) => $.screens.resetPass.submit)}
			</Button>
		</form>
	);
});
