import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Eye, EyeClosed, Lock, LockKeyhole, LockOpen } from 'lucide-react';

import { PasswordHint } from '@/features/auth';
import { cn } from '@/shared/lib/utils';
import { Button, Divider, Input } from '@/shared/ui';

import { Row } from '.';

export const PasswordBlock = () => {
	const { t: tSettings } = useTranslation('settings');
	const { t: tAuth } = useTranslation('auth');

	const [visiblePass, setVisiblePass] = useState(false);
	const [showPass, setShowPass] = useState(false);
	const [showHint, setShowHint] = useState(false);

	const [tempPassOld, setTempPassOld] = useState('');
	const [tempPassNew, setTempPassNew] = useState('');
	const [tempPassNewConfirm, setTempPassNewConfirm] = useState('');
	const [isPassValid, setIsPassValid] = useState(false);

	const PassIcon = showPass ? EyeClosed : Eye;
	const canSavePassword = tempPassNew !== '' && tempPassNewConfirm === tempPassNew && isPassValid;

	const applyAvatar = () => {
		if (!canSavePassword) return;
		setShowPass(false);
	};

	return (
		<>
			<Row icon={Lock} label={tAuth(($) => $.fields.password.label)}>
				<Button
					className={cn(
						'w-full hover:shadow-(--shadow) lg:w-fit lg:min-w-72',
						canSavePassword && 'active-btn'
					)}
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
							placeholder={tAuth(($) => $.fields.password.placeholder)}
							rightIcon={
								<PassIcon
									className="mr-1 ml-2 size-5 cursor-pointer hover:text-(--accent-primary-hover)"
									onClick={() => setShowPass((prev) => !prev)}
								/>
							}
							type={showPass ? 'text' : 'password'}
							value={tempPassOld}
							onChange={(e) => setTempPassOld(e.target.value)}
						/>
					</Row>
					<Row htmlFor="pass-new" icon={LockKeyhole} label={tSettings(($) => $.account.password.new)}>
						<div className="relative w-full lg:ml-auto lg:w-72">
							<Input
								className="lg:ml-auto lg:w-72"
								id="pass-new"
								placeholder={tAuth(($) => $.fields.password.placeholder)}
								rightIcon={
									<PassIcon
										className="mr-1 ml-2 size-5 cursor-pointer hover:text-(--accent-primary-hover)"
										onClick={() => setShowPass((prev) => !prev)}
									/>
								}
								type={showPass ? 'text' : 'password'}
								value={tempPassNew}
								onBlur={() => setShowHint(false)}
								onChange={(e) => setTempPassNew(e.target.value)}
								onFocus={() => setShowHint(true)}
							/>
							<PasswordHint
								password={tempPassNew}
								showHint={showHint}
								onValidityChange={setIsPassValid}
							/>
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
							placeholder={tAuth(($) => $.fields.passConfirm.placeholder)}
							rightIcon={
								<PassIcon
									className="mr-1 ml-2 size-5 cursor-pointer hover:text-(--accent-primary-hover)"
									onClick={() => setShowPass((prev) => !prev)}
								/>
							}
							type={showPass ? 'text' : 'password'}
							value={tempPassNewConfirm}
							onChange={(e) => setTempPassNewConfirm(e.target.value)}
						/>
					</Row>
					<Button
						className="col-span-4 mx-auto mt-2 max-w-64 hover:shadow-(--shadow)"
						disabled={!canSavePassword}
						onClick={applyAvatar}
					>
						{tSettings(($) => $.account.password.save)}
					</Button>
				</>
			)}
		</>
	);
};
