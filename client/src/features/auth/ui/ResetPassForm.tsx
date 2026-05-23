import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Eye, EyeClosed, Lock } from 'lucide-react';
import { observer } from 'mobx-react-lite';

import { useStore } from '@/app/providers';
import { cn } from '@/shared/lib/utils';
import { validatePasswords } from '@/shared/lib/validators';
import { Button, Input } from '@/shared/ui';

import { PasswordHint } from '.';

export const ResetPassForm = observer(() => {
	const { t } = useTranslation('auth');

	const { authStore, notifyStore } = useStore();

	const [password, setPassword] = useState('');
	const [passConfirm, setPassConfirm] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [showHint, setShowHint] = useState(false);
	const [isPasswordValid, setIsPasswordValid] = useState(true);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		try {
			await validatePasswords(password, passConfirm);
			// await authStore.resetPassword(email, password);
		} catch (error: any) {
			notifyStore.setNotice(error.message || t(($) => $.resetPass.error), 'error');
		}
	};

	let PassIcon = showPassword ? EyeClosed : Eye;

	return (
		<form className="flex w-full max-w-md flex-col gap-4" name="reset-pass-form" onSubmit={handleSubmit}>
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
							onClick={() => setShowPassword((prev) => !prev)}
						/>
					}
					type={showPassword ? 'text' : 'password'}
					value={password}
					onBlur={() => setShowHint(false)}
					onChange={(e) => setPassword(e.target.value)}
					onFocus={() => setShowHint(true)}
				/>
				<PasswordHint
					password={password}
					showHint={showHint}
					onValidityChange={(value) => setIsPasswordValid(value)}
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
						onClick={() => setShowPassword((prev) => !prev)}
					/>
				}
				type={showPassword ? 'text' : 'password'}
				value={passConfirm}
				onChange={(e) => setPassConfirm(e.target.value)}
			/>
			<Button
				className={cn(
					'mt-4 h-10 w-full bg-(--bg-secondary)',
					password !== '' && passConfirm !== '' && 'active-btn'
				)}
				disabled={!isPasswordValid}
				loading={authStore.isLoading}
				type="submit"
			>
				{t(($) => $.resetPass.submit)}
			</Button>
		</form>
	);
});
