import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
	CircleUserRound,
	Contrast,
	Eye,
	EyeClosed,
	Languages,
	Lock,
	LockKeyhole,
	LockOpen,
	Mail,
	Moon,
	Save,
	Sun,
	SunMoon,
} from 'lucide-react';
import { observer } from 'mobx-react-lite';

import { useStore } from '@/app/providers';
import { PasswordHint } from '@/features/auth';
import LanguageSelect from '@/features/language-switcher';
import type { Theme } from '@/features/theme-switcher';
import { AVATARS } from '@/shared/assets/images/avatars';
import { cn } from '@/shared/lib/utils';
import { Button, Divider, Input, Select } from '@/shared/ui';

export const TabSettings = observer(() => {
	const { t: tSettings } = useTranslation('settings');
	const { t: tAuth } = useTranslation('auth');

	const { userStore, themeStore } = useStore();

	const [visiblePass, setVisiblePass] = useState(false);
	const [visibleAvatars, setVisibleAvatars] = useState(false);
	const [showPass, setShowPass] = useState(false);
	const [showHint, setShowHint] = useState(false);

	const [tempUsername, setTempUsername] = useState(userStore.username ?? '');
	const [tempEmail, setTempEmail] = useState(userStore.email ?? '');
	const [tempPassOld, setTempPassOld] = useState('');
	const [tempPassNew, setTempPassNew] = useState('');
	const [tempPassNewConfirm, setTempPassNewConfirm] = useState('');

	const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
	const [activeField, setActiveField] = useState<string | null>(null);
	const [isPassValid, setIsPassValid] = useState(false);

	const PassIcon = showPass ? EyeClosed : Eye;

	const onChangeTheme = (theme: Theme) => {
		if (theme === themeStore.theme) return;
		themeStore.setTheme(theme);
	};

	useEffect(() => {
		if (!userStore.user) return;

		setTempUsername(userStore.username ?? '');
		setTempEmail(userStore.email ?? '');
	}, [userStore.user]);

	return (
		<>
			<div className="flex flex-col gap-4">
				<h2 className="text-lg leading-4 text-(--color-secondary) opacity-70 select-none">
					{tSettings(($) => $.account.title)}
				</h2>
				<div className="core-border flex min-h-0 flex-1 gap-4 bg-(--bg-secondary)/50 p-4 select-none">
					<img
						alt={tSettings(($) => $.account.avatar.alt)}
						className="size-40 cursor-pointer rounded-full border-2 border-transparent ring-inset hover:border-(--accent-primary-hover)"
						src={userStore.avatar}
						onClick={() => setVisibleAvatars((prev) => !prev)}
					/>
					<div className="h-full w-px bg-(--border-color)" />
					{visibleAvatars ? (
						<div className="grid flex-1 grid-cols-4 gap-2">
							{AVATARS.map((src, idx) => (
								<img
									key={src}
									alt={`Аватар ${idx}`}
									className={cn(
										'aspect-square size-28 cursor-pointer rounded-full object-cover transition',
										'hover:scale-[1.2]',
										selectedAvatar === src && 'ring-3 ring-(--accent-primary)'
									)}
									src={src}
									onClick={() => setSelectedAvatar(src)}
								/>
							))}
							<Button
								className="col-span-4 mx-auto mt-4 max-w-64"
								disabled={!selectedAvatar || userStore.avatar === selectedAvatar}
								onClick={() => {
									selectedAvatar && userStore.updateAvatar(selectedAvatar);
									setVisibleAvatars(false);
								}}
							>
								{tSettings(($) => $.account.avatar.apply)}
							</Button>
						</div>
					) : (
						<div className="flex flex-1 flex-col gap-4">
							<div className="flex items-center">
								<div className="flex w-full gap-2">
									<CircleUserRound />
									{tAuth(($) => $.fields.username.label)}
								</div>
								<Input
									className="w-72"
									placeholder={tAuth(($) => $.fields.username.placeholder)}
									rightIcon={
										activeField === 'name' && (
											<Button
												centerIcon={<Save className="size-5" />}
												className="pr-1"
												size="custom"
												variant="mobile"
												onClick={() => userStore.updateUsername(tempUsername)}
											/>
										)
									}
									value={tempUsername}
									onBlur={() => setActiveField(null)}
									onChange={(e) => setTempUsername(e.target.value)}
									onFocus={() => setActiveField('name')}
								/>
							</div>
							<div className="flex items-center">
								<div className="flex w-full gap-2">
									<Mail />
									{tAuth(($) => $.fields.email.label)}
								</div>
								<Input
									className="w-72"
									placeholder={tAuth(($) => $.fields.email.placeholder)}
									rightIcon={
										activeField === 'email' && (
											<Button
												centerIcon={<Save className="size-5" />}
												className="pr-1"
												size="custom"
												variant="mobile"
												onClick={() => userStore.updateEmail(tempEmail)}
											/>
										)
									}
									value={tempEmail}
									onBlur={() => setActiveField(null)}
									onChange={(e) => setTempEmail(e.target.value)}
									onFocus={() => setActiveField('email')}
								/>
							</div>
							<div className="flex items-center">
								<div className="flex w-full gap-2">
									<Lock />
									{tAuth(($) => $.fields.password.label)}
								</div>
								<Button
									className={cn(
										'min-w-72',
										tempPassNew !== '' &&
											tempPassNewConfirm === tempPassNew &&
											isPassValid &&
											'active-btn'
									)}
									onClick={() => setVisiblePass((prev) => !prev)}
								>
									{visiblePass
										? tSettings(($) => $.account.password.save)
										: tSettings(($) => $.account.password.change)}
								</Button>
							</div>
							{visiblePass && (
								<>
									<Divider />
									<div className="flex w-full items-center justify-between gap-2">
										<label className="flex w-full gap-2" htmlFor="pass-old">
											<LockOpen />
											{tSettings(($) => $.account.password.old)}
										</label>
										<Input
											className="w-72"
											id="pass-old"
											placeholder={tAuth(($) => $.fields.password.placeholder)}
											rightIcon={
												<PassIcon
													className="size-5 cursor-pointer hover:text-(--accent-primary-hover)"
													onClick={() => setShowPass((prev) => !prev)}
												/>
											}
											type={showPass ? 'text' : 'password'}
											value={tempPassOld}
											onChange={(e) => setTempPassOld(e.target.value.trim())}
										/>
									</div>
									<div className="flex w-full items-center justify-between gap-2">
										<label className="flex w-full gap-2" htmlFor="pass-new">
											<LockKeyhole />
											{tSettings(($) => $.account.password.new)}
										</label>
										<div className="relative">
											<Input
												className="w-72"
												id="pass-new"
												placeholder={tAuth(($) => $.fields.password.placeholder)}
												rightIcon={
													<PassIcon
														className="size-5 cursor-pointer hover:text-(--accent-primary-hover)"
														onClick={() => setShowPass((prev) => !prev)}
													/>
												}
												type={showPass ? 'text' : 'password'}
												value={tempPassNew}
												onBlur={() => setShowHint(false)}
												onChange={(e) => setTempPassNew(e.target.value.trim())}
												onFocus={() => setShowHint(true)}
											/>
											<PasswordHint
												password={tempPassNew}
												showHint={showHint}
												onValidityChange={(value) => setIsPassValid(value)}
											/>
										</div>
									</div>
									<div className="flex w-full items-center justify-between gap-2">
										<label className="flex w-full gap-2" htmlFor="pass-new-confirm">
											<LockKeyhole />
											{tSettings(($) => $.account.password.confirm)}
										</label>
										<Input
											className="w-72"
											id="pass-new-confirm"
											placeholder={tAuth(($) => $.fields.passConfirm.placeholder)}
											rightIcon={
												<PassIcon
													className="size-5 cursor-pointer hover:text-(--accent-primary-hover)"
													onClick={() => setShowPass((prev) => !prev)}
												/>
											}
											type={showPass ? 'text' : 'password'}
											value={tempPassNewConfirm}
											onChange={(e) => setTempPassNewConfirm(e.target.value.trim())}
										/>
									</div>
								</>
							)}
						</div>
					)}
				</div>
			</div>
			<div className="flex flex-col gap-4 select-none">
				<h2 className="text-lg leading-4 text-(--color-secondary) opacity-70">
					{tSettings(($) => $.general.title)}
				</h2>
				<div className="core-border flex min-h-0 flex-1 flex-col gap-4 bg-(--bg-secondary)/50 p-4">
					<div className="flex flex-col gap-4">
						<div className="flex items-center">
							<div className="flex w-full gap-2">
								<SunMoon />
								{tSettings(($) => $.general.theme.label)}
							</div>
							<Select
								className="w-36"
								options={[
									{
										value: 'system',
										label: tSettings(($) => $.general.theme.system),
										icon: Contrast,
									},
									{ value: 'dark', label: tSettings(($) => $.general.theme.dark), icon: Moon },
									{ value: 'light', label: tSettings(($) => $.general.theme.light), icon: Sun },
								]}
								placeholder="Выберите"
								value={themeStore.theme}
								visibleIcon={false}
								onChange={(value) => onChangeTheme(value as Theme)}
							/>
						</div>
						<div className="flex items-center">
							<div className="flex w-full gap-2">
								<Languages />
								{tSettings(($) => $.general.language.label)}
							</div>
							<LanguageSelect />
						</div>
					</div>
				</div>
			</div>
		</>
	);
});
