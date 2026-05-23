import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Eye, EyeClosed, Lock, Mail, User } from 'lucide-react';
import { observer } from 'mobx-react-lite';

import { useStore } from '@/app/providers';
import { cn } from '@/shared/lib/utils';
import { validateEmail, validatePasswords, validateUsername } from '@/shared/lib/validators';
import { Button, Input } from '@/shared/ui';

import { PasswordHint } from '.';

export const RegisterForm = observer(() => {
	const { t } = useTranslation('auth');

	const { authStore, notifyStore } = useStore();

	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [passConfirm, setPassConfirm] = useState('');
	const [showPass, setShowPass] = useState(false);
	const [showHint, setShowHint] = useState(false);
	const [isPassValid, setIsPassValid] = useState(true);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		try {
			await validateUsername(username);
			await validateEmail(email);
			await validatePasswords(password, passConfirm);

			// await authStore.register(email, password);
		} catch (error: any) {
			notifyStore.setNotice(error.message || t(($) => $.register.error), 'error');
		}
	};

	const PassIcon = showPass ? EyeClosed : Eye;

	return (
		<form className="flex w-full max-w-md flex-col gap-4" name="register-form" onSubmit={handleSubmit}>
			<Input
				className="border border-(--border-color) bg-(--bg-secondary)/50 pl-11.5 hover:border-(--accent-primary-hover)"
				leftIcon={
					<div className="border-r border-(--border-color)">
						<User className="mr-2 ml-1 size-5" />
					</div>
				}
				placeholder={t(($) => $.fields.username.placeholder)}
				type="text"
				value={username}
				onChange={(e) => setUsername(e.target.value.trim())}
			/>
			<Input
				className="border border-(--border-color) bg-(--bg-secondary)/50 pl-11.5 hover:border-(--accent-primary-hover)"
				leftIcon={
					<div className="border-r border-(--border-color)">
						<Mail className="mr-2 ml-1 size-5" />
					</div>
				}
				placeholder={t(($) => $.fields.email.placeholder)}
				type="email"
				value={email}
				onChange={(e) => setEmail(e.target.value.trim())}
			/>
			<div className="relative">
				<Input
					className="border border-(--border-color) bg-(--bg-secondary)/50 pl-11.5 hover:border-(--accent-primary-hover)"
					leftIcon={
						<div className="border-r border-(--border-color)">
							<Lock className="mr-2 ml-1 size-5" />
						</div>
					}
					placeholder={t(($) => $.fields.password.placeholder)}
					rightIcon={
						<PassIcon
							className="mr-1 ml-2 size-5 cursor-pointer hover:text-(--accent-primary-hover)"
							onClick={() => setShowPass((prev) => !prev)}
						/>
					}
					type={showPass ? 'text' : 'password'}
					value={password}
					onBlur={() => setShowHint(false)}
					onChange={(e) => setPassword(e.target.value.trim())}
					onFocus={() => setShowHint(true)}
				/>
				<PasswordHint
					password={password}
					showHint={showHint}
					onValidityChange={(value) => setIsPassValid(value)}
				/>
			</div>
			<Input
				className="border border-(--border-color) bg-(--bg-secondary)/50 pl-11.5 hover:border-(--accent-primary-hover)"
				leftIcon={
					<div className="border-r border-(--border-color)">
						<Lock className="mr-2 ml-1 size-5" />
					</div>
				}
				placeholder={t(($) => $.fields.passConfirm.placeholder)}
				rightIcon={
					<PassIcon
						className="mr-1 ml-2 size-5 cursor-pointer hover:text-(--accent-primary-hover)"
						onClick={() => setShowPass((prev) => !prev)}
					/>
				}
				type={showPass ? 'text' : 'password'}
				value={passConfirm}
				onChange={(e) => setPassConfirm(e.target.value.trim())}
			/>
			<Button
				className={cn(
					'mt-4 h-10 w-full bg-(--bg-secondary)',
					username !== '' && password !== '' && email !== '' && isPassValid && 'active-btn'
				)}
				disabled={!isPassValid}
				loading={authStore.isLoading}
				// onClick={() => notifyStore.setNotice('Регистрация временно приостановлена', 'info')}
				type="submit"
			>
				{t(($) => $.register.submit)}
			</Button>
		</form>
	);
});
