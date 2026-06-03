import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Eye, EyeClosed, Lock, LockKeyhole, LockOpen } from 'lucide-react';
import { observer } from 'mobx-react-lite';

import { useStore } from '@/app/providers';
import { updatePassword } from '@/entities/user';
import { getAuthErrorMessage, PasswordHint, useAuth } from '@/features/auth';
import { cn } from '@/shared/lib/utils';
import { Button, Divider, Input } from '@/shared/ui';

import { Row } from '.';

export const PasswordBlock = observer(() => {
	const { t: tSettings } = useTranslation('settings');
	const { t: tAuth } = useTranslation('auth');

	const { notifyStore } = useStore();
	const { checkPassword } = useAuth(tAuth);

	const [isLoading, setIsLoading] = useState(false);

	const [visiblePass, setVisiblePass] = useState(false);
	const [showPass, setShowPass] = useState(false);
	const [showHint, setShowHint] = useState(false);

	const [passOld, setPassOld] = useState('');
	const [passNew, setPassNew] = useState('');
	const [passConfirm, setPassConfirm] = useState('');

	const canSavePassword = passOld !== '' && passNew !== '' && passConfirm === passNew;

	const PassIcon = showPass ? EyeClosed : Eye;

	const applyPassword = async () => {
		if (!canSavePassword) return;
		if (!checkPassword(passNew)) return;

		if (passNew !== passConfirm) {
			notifyStore.setNotice(
				tAuth(($) => $.errors.invalid.passwordMismatch),
				'info'
			);
			return;
		}

		setIsLoading(true);

		try {
			await updatePassword({
				current_password: passOld,
				password: passNew,
				password_confirmation: passConfirm,
			});

			notifyStore.setNotice(
				tSettings(($) => $.success.password),
				'success'
			);

			setPassOld('');
			setPassNew('');
			setPassConfirm('');
			setShowPass(false);
			setVisiblePass(false);
		} catch (error: any) {
			const code = error?.response?.data?.code;
			notifyStore.setNotice(getAuthErrorMessage(tAuth, code), 'error');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<>
			<Row icon={Lock} label={tAuth(($) => $.common.fields.password.label)}>
				<Button
					className={cn('w-full hover:shadow-(--shadow) lg:w-fit lg:min-w-72')}
					disabled={isLoading}
					onClick={() => setVisiblePass((prev) => !prev)}
				>
					{visiblePass
						? tSettings(($) => $.account.password.hide)
						: tSettings(($) => $.account.password.change)}
				</Button>
			</Row>
			{visiblePass && (
				<>
					<Divider />
					<Row htmlFor="pass-old" icon={LockOpen} label={tSettings(($) => $.account.password.old)}>
						<Input
							className="lg:ml-auto lg:w-72"
							id="pass-old"
							placeholder={tAuth(($) => $.common.fields.password.placeholder)}
							rightIcon={
								<PassIcon
									className="mr-1 ml-2 size-5 cursor-pointer hover:text-(--accent-primary-hover)"
									onClick={() => setShowPass((prev) => !prev)}
								/>
							}
							type={showPass ? 'text' : 'password'}
							value={passOld}
							onChange={(e) => setPassOld(e.target.value)}
						/>
					</Row>
					<Row htmlFor="pass-new" icon={LockKeyhole} label={tSettings(($) => $.account.password.new)}>
						<div className="relative w-full lg:ml-auto lg:w-72">
							<Input
								className="lg:ml-auto lg:w-72"
								id="pass-new"
								placeholder={tAuth(($) => $.common.fields.password.placeholder)}
								rightIcon={
									<PassIcon
										className="mr-1 ml-2 size-5 cursor-pointer hover:text-(--accent-primary-hover)"
										onClick={() => setShowPass((prev) => !prev)}
									/>
								}
								type={showPass ? 'text' : 'password'}
								value={passNew}
								onBlur={() => setShowHint(false)}
								onChange={(e) => setPassNew(e.target.value)}
								onFocus={() => setShowHint(true)}
							/>
							<PasswordHint password={passNew} showHint={showHint} />
						</div>
					</Row>
					<Row
						htmlFor="pass-new-confirm"
						icon={LockKeyhole}
						label={tSettings(($) => $.account.password.confirm)}
					>
						<Input
							className="lg:ml-auto lg:w-72"
							id="pass-new-confirm"
							placeholder={tAuth(($) => $.common.fields.passConfirm.placeholder)}
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
					</Row>
					<Button
						className={cn(
							'col-span-4 mx-auto mt-2 w-full hover:shadow-(--shadow) xl:w-64',
							canSavePassword && 'active-btn'
						)}
						disabled={isLoading || !canSavePassword}
						loading={isLoading}
						onClick={applyPassword}
					>
						{tSettings(($) => $.account.password.save)}
					</Button>
				</>
			)}
		</>
	);
});
