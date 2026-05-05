import { useEffect, useState } from 'react';
import { CircleUserRound, Contrast, Languages, Lock, Mail, Moon, Save, Sun, SunMoon } from 'lucide-react';
import { observer } from 'mobx-react-lite';

import { useStore } from '@/app/providers';
import { Theme } from '@/features/theme-switcher/model';
import { AVATARS } from '@/shared/assets/images/avatars';
import { cn } from '@/shared/lib/utils';
import { Button, Divider, Input, Select } from '@/shared/ui';

export const TabSettings = observer(() => {
	const { userStore, themeStore } = useStore();
	const [visiblePass, setVisiblePass] = useState(false);
	const [visibleAvatars, setVisibleAvatars] = useState(false);
	const [tempUsername, setTempUsername] = useState<string>(userStore.username);
	const [tempEmail, setTempEmail] = useState<string>(userStore.email);
	const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
	const [activeField, setActiveField] = useState<string | null>(null);
	const onClick = () => console.log(1);

	const onChangeTheme = (theme: Theme) => {
		if (theme === themeStore.theme) return;
		themeStore.setTheme(theme);
	};

	useEffect(() => {
		if (!userStore.user) return;

		setTempUsername(userStore.username);
		setTempEmail(userStore.email);
	}, [userStore.user]);

	return (
		<>
			<div className="flex flex-col gap-4">
				<h2 className="text-lg leading-4 text-(--color-secondary) opacity-70">Аккаунт</h2>
				<div className="flex min-h-0 flex-1 gap-4 rounded-2xl border border-(--border-color) bg-(--bg-secondary)/50 p-4">
					<div className="flex w-full gap-4">
						<div className="flex flex-col items-center justify-between gap-2">
							<div className="flex size-40 cursor-pointer flex-col gap-4 rounded-full ring-(--accent-primary-hover) ring-inset hover:ring-1 focus:ring-1">
								<img
									className="rounded-full"
									src={userStore.avatar}
									onClick={() => setVisibleAvatars((prev) => !prev)}
								/>
							</div>
						</div>
						<div className="h-full w-px bg-(--border-color)" />
						{visibleAvatars ? (
							<div className="grid flex-1 grid-cols-4 gap-2 pb-2">
								{AVATARS.map((src, idx) => (
									<img
										key={src}
										alt={`Аватар ${idx}`}
										className={cn(
											'aspect-square size-32 cursor-pointer rounded-full object-cover transition',
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
									Применить аватар
								</Button>
							</div>
						) : (
							<div className="flex flex-1 flex-col gap-4">
								<div className="flex w-full items-center justify-between gap-2">
									<div className="flex w-full gap-2">
										<CircleUserRound />
										Имя пользователя
									</div>
									<Input
										className="w-72"
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
								<div className="justify-betweenw-full flex items-center gap-2">
									<div className="flex w-full gap-2">
										<Mail />
										Электронная почта
									</div>
									<Input
										className="w-72"
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
								<div className="flex w-full items-center justify-between gap-2">
									<div className="flex gap-2">
										<Lock />
										Пароль
									</div>
									<Button className="w-72" onClick={() => setVisiblePass((prev) => !prev)}>
										{visiblePass ? 'Сохранить пароль' : 'Сменить пароль'}
									</Button>
								</div>
								{visiblePass && (
									<>
										<Divider />
										<div className="flex w-full items-center justify-between gap-2">
											<div className="flex w-full gap-2">
												<span>Введите старый пароль</span>
											</div>
											<Input className="w-72" />
										</div>
										<div className="flex w-full items-center justify-between gap-2">
											<div className="flex w-full gap-2">
												<span>Введите новый пароль</span>
											</div>
											<Input className="w-72" />
										</div>
										<div className="flex w-full items-center justify-between gap-2">
											<div className="flex w-full gap-2">
												<span>Подтвердите новый пароль</span>
											</div>
											<Input className="w-72" />
										</div>
									</>
								)}
							</div>
						)}
					</div>
				</div>
			</div>
			<div className="flex flex-col gap-4">
				<h2 className="text-lg leading-4 text-(--color-secondary) opacity-70">Основные</h2>
				<div className="flex min-h-0 flex-1 flex-col gap-4 rounded-2xl border border-(--border-color) bg-(--bg-secondary)/50 p-4">
					<div className="flex flex-col gap-4">
						<div className="flex w-full items-center gap-2">
							<div className="flex w-full gap-2">
								<SunMoon />
								Внешний вид
							</div>
							<Select
								className="w-36"
								options={[
									{ value: 'system', label: 'Системная', icon: Contrast },
									{ value: 'dark', label: 'Темная', icon: Moon },
									{ value: 'light', label: 'Светлая', icon: Sun },
								]}
								placeholder="Выберите"
								value="dark"
								visibleIcon={false}
								onChange={(value) => onChangeTheme(value as Theme)}
							/>
						</div>
						<div className="flex w-full items-center gap-2">
							<div className="flex w-full gap-2">
								<Languages />
								Язык
							</div>
							<Select
								className="w-36"
								options={[
									{ value: 'ru', label: 'Русский' },
									{ value: 'en', label: 'English' },
								]}
								placeholder="Выберите"
								value="ru"
								onChange={onClick}
							/>
						</div>
					</div>
				</div>
			</div>
		</>
	);
});
