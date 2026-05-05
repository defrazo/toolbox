import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeClosed, Lock, Mail } from 'lucide-react';
import { observer } from 'mobx-react-lite';

import { useStore } from '@/app/providers';
import { Button, Input } from '@/shared/ui';

export const LoginForm = observer(() => {
	const { authStore, notifyStore } = useStore();

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [showPass, setShowPass] = useState(false);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		try {
			await authStore.login(email, password);
		} catch (error: any) {
			notifyStore.setNotice(error?.response?.data?.message || 'Ошибка входа', 'error');
		}
	};

	const PassIcon = showPass ? EyeClosed : Eye;

	return (
		<form className="flex w-full max-w-md flex-col gap-4" onSubmit={handleSubmit}>
			<Input
				className="border border-(--border-color) bg-(--bg-secondary)/50 pl-11 ring-0! hover:border-(--accent-primary-hover)"
				leftIcon={
					<div className="border-r border-(--border-color)">
						<Mail className="mr-1 size-6" />
					</div>
				}
				placeholder="E-mail"
				value={email}
				onChange={(e) => setEmail(e.target.value)}
			/>
			<Input
				className="border border-(--border-color) bg-(--bg-secondary)/50 pl-11 ring-0! hover:border-(--accent-primary-hover)"
				leftIcon={
					<div className="border-r border-(--border-color)">
						<Lock className="mr-1 size-6" />
					</div>
				}
				placeholder="Пароль"
				rightIcon={
					<PassIcon
						className="size-5 cursor-pointer hover:text-(--accent-primary-hover)"
						onClick={() => setShowPass((prev) => !prev)}
					/>
				}
				type={showPass ? 'text' : 'password'}
				value={password}
				onChange={(e) => setPassword(e.target.value)}
			/>
			<Link className="ml-auto text-sm hover:text-(--accent-primary-hover)" to="/forgot-password">
				Забыли пароль?
			</Link>
			<Button
				className="mt-4 h-10 w-full bg-linear-to-br from-[#5b5cff] via-[#7a5cff] to-[#4da3ff] hover:shadow-[0_6px_30px_rgba(91,92,255,0.45),0_0_25px_rgba(77,163,255,0.35)]"
				loading={authStore.isLoading}
				type="submit"
			>
				Войти
			</Button>
		</form>
	);
});
