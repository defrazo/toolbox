import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Eye, EyeClosed, Lock, Mail } from 'lucide-react';
import { observer } from 'mobx-react-lite';

import { useStore } from '@/app/providers';
import { cn } from '@/shared/lib/utils';
import { Button, Input } from '@/shared/ui';

export const LoginForm = observer(() => {
	const { t } = useTranslation('auth');

	const { authStore, notifyStore } = useStore();

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [showPass, setShowPass] = useState(false);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		try {
			await authStore.login(email, password);
		} catch (error: any) {
			notifyStore.setNotice(error?.response?.data?.message || t(($) => $.login.error), 'error');
		}
	};

	const PassIcon = showPass ? EyeClosed : Eye;

	return (
		<form className="flex w-full max-w-md flex-col gap-4" name="login-form" onSubmit={handleSubmit}>
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
				onChange={(e) => setPassword(e.target.value)}
			/>
			<Link className="ml-auto text-sm select-none hover:text-(--accent-primary-hover)" to="/forgot-password">
				{t(($) => $.login.forgotPass)}
			</Link>
			<Button
				className={cn('mt-4 h-10 w-full bg-(--bg-secondary)', email !== '' && password !== '' && 'active-btn')}
				loading={authStore.isLoading}
				type="submit"
			>
				{t(($) => $.login.submit)}
			</Button>
		</form>
	);
});
