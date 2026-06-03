import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeClosed, KeyRound, Lock, Mail, User } from 'lucide-react';
import { observer } from 'mobx-react-lite';

import { useStore } from '@/app/providers';
import { Button, Input } from '@/shared/ui';

import { verifyInvite } from '../api';
import { getAuthErrorMessage } from '../lib';
import { useAuth } from '../model';
import { PasswordHint } from '.';

export const RegisterForm = observer(({ isPrivacyAccepted }: { isPrivacyAccepted: boolean }) => {
	const { t } = useTranslation('auth');
	const navigate = useNavigate();

	const { authStore, notifyStore } = useStore();
	const { checkUsername, checkEmail, checkPassword, checkInvite } = useAuth(t);

	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [passConfirm, setPassConfirm] = useState('');
	const [inviteCode, setInviteCode] = useState('');

	const [showPass, setShowPass] = useState(false);
	const [showHint, setShowHint] = useState(false);
	const [isVerifying, setIsVerifying] = useState(false);

	const PassIcon = showPass ? EyeClosed : Eye;

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!checkUsername(username)) return;
		if (!checkEmail(email)) return;
		if (!checkPassword(password)) return;

		if (password !== passConfirm) {
			notifyStore.setNotice(
				t(($) => $.errors.invalid.passwordMismatch),
				'info'
			);
			return;
		}

		if (!checkInvite(inviteCode)) return;

		if (!isPrivacyAccepted) {
			notifyStore.setNotice(
				t(($) => $.errors.privacy),
				'error'
			);
			return;
		}

		try {
			setIsVerifying(true);
			const { data } = await verifyInvite(inviteCode);
			setIsVerifying(false);

			await authStore.register(username, email, password, passConfirm, data.invite_token, isPrivacyAccepted);

			notifyStore.setNotice(
				t(($) => $.success.register),
				'success'
			);

			sessionStorage.setItem('pendingVerificationEmail', email);

			navigate('/email/verify', { state: { email } });
		} catch (error: any) {
			setIsVerifying(false);

			const code = error?.response?.data?.code;
			notifyStore.setNotice(getAuthErrorMessage(t, code), 'error');
		}
	};

	return (
		<form className="flex w-full max-w-md flex-col gap-4" name="register-form" onSubmit={handleSubmit}>
			<Input
				className="border border-(--border-color) bg-(--bg-secondary)/50 pl-11.5 hover:border-(--accent-primary-hover)"
				leftIcon={
					<div className="border-r border-(--border-color)">
						<User className="mr-2 ml-1 size-5" />
					</div>
				}
				placeholder={t(($) => $.common.fields.username.placeholder)}
				type="text"
				value={username}
				onChange={(e) => setUsername(e.target.value)}
			/>
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
			<div className="relative">
				<Input
					className="border border-(--border-color) bg-(--bg-secondary)/50 pl-11.5 hover:border-(--accent-primary-hover)"
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
					onBlur={() => setShowHint(false)}
					onChange={(e) => setPassword(e.target.value)}
					onFocus={() => setShowHint(true)}
				/>
				<PasswordHint password={password} showHint={showHint} />
			</div>
			<Input
				className="border border-(--border-color) bg-(--bg-secondary)/50 pl-11.5 hover:border-(--accent-primary-hover)"
				leftIcon={
					<div className="border-r border-(--border-color)">
						<Lock className="mr-2 ml-1 size-5" />
					</div>
				}
				placeholder={t(($) => $.common.fields.passConfirm.placeholder)}
				rightIcon={
					<PassIcon
						className="mr-1 ml-2 size-5 cursor-pointer hover:text-(--accent-primary-hover)"
						onClick={() => setShowPass((prev) => !prev)}
					/>
				}
				type={showPass ? 'text' : 'password'}
				value={passConfirm}
				onChange={(e) => setPassConfirm(e.target.value)}
			/>
			<Input
				className="border border-(--border-color) bg-(--bg-secondary)/50 pl-11.5 hover:border-(--accent-primary-hover)"
				leftIcon={
					<div className="border-r border-(--border-color)">
						<KeyRound className="mr-2 ml-1 size-5" />
					</div>
				}
				placeholder={t(($) => $.common.fields.invite.placeholder)}
				type="text"
				value={inviteCode}
				onChange={(e) => setInviteCode(e.target.value)}
			/>
			<Button
				className="active-btn mt-4 h-10 w-full bg-(--bg-secondary)"
				loading={isVerifying || authStore.isLoading}
				type="submit"
			>
				{t(($) => $.screens.register.submit)}
			</Button>
		</form>
	);
});
