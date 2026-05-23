import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { LifeBuoy, LogOut, Mail, Settings } from 'lucide-react';
import { observer } from 'mobx-react-lite';

import { useStore } from '@/app/providers';
import { Button, Divider } from '@/shared/ui';

interface UserMenuProps {
	isMenuOpen: boolean;
	triggerRef: React.RefObject<HTMLButtonElement | null>;
	setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
	setIsSidebarOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

export const UserMenu = observer(({ isMenuOpen, setIsMenuOpen, setIsSidebarOpen, triggerRef }: UserMenuProps) => {
	const { t } = useTranslation('nav');

	const { tabsStore, userStore, authStore } = useStore();

	const menuRef = useRef<HTMLDivElement>(null);

	const navButtons = [
		{
			id: 'settings',
			title: t(($) => $.userMenu.settings),
			icon: Settings,
			action: () => {
				tabsStore.setTab('settings');
				setIsMenuOpen(false);
				setIsSidebarOpen?.(false);
			},
		},
		{
			id: 'help',
			title: t(($) => $.userMenu.help),
			icon: LifeBuoy,
			action: () => {
				tabsStore.setTab('help');
				setIsMenuOpen(false);
				setIsSidebarOpen?.(false);
			},
		},
		{
			id: 'logout',
			title: t(($) => $.userMenu.logout),
			icon: LogOut,
			action: () => {
				authStore.logout();
				setIsMenuOpen(false);
				setIsSidebarOpen?.(false);
			},
		},
	];

	useEffect(() => {
		if (!isMenuOpen) return;

		const handleOutside = (event: PointerEvent) => {
			const target = event.target as Node;

			if (menuRef.current?.contains(target) || triggerRef.current?.contains(target)) return;

			setIsMenuOpen(false);
		};

		document.addEventListener('pointerdown', handleOutside);

		return () => document.removeEventListener('pointerdown', handleOutside);
	}, [isMenuOpen, setIsMenuOpen, triggerRef]);

	if (!isMenuOpen) return null;

	return (
		<div
			ref={menuRef}
			className="animate-in fade-in slide-in-from-bottom-2 core-border absolute bottom-full left-0 z-30 mb-2 flex w-full flex-col gap-1 bg-(--bg-secondary) p-2 shadow-lg backdrop-blur-md xl:w-60"
		>
			<div className="flex cursor-default items-center gap-2 px-2 py-1 text-sm text-(--color-disabled)">
				<Mail className="size-4" />
				{userStore.email ? `${userStore.email}` : 'E-mail'}
			</div>
			<Divider className="bg-(--color-disabled)" />
			{navButtons.slice(0, 2).map(({ id, title, icon: Icon, action }) => (
				<Button
					key={id}
					className="justify-start rounded-lg px-2 py-0.5 text-left text-lg text-(--accent-primary-text) xl:text-base"
					leftIcon={<Icon className="size-4" />}
					size="custom"
					variant="mobile"
					onClick={action}
				>
					{title}
				</Button>
			))}
			<Divider className="bg-(--color-disabled)" />
			{navButtons.slice(2).map(({ id, title, icon: Icon, action }) => (
				<Button
					key={id}
					className="justify-start rounded-lg px-2 py-0.5 text-left text-lg text-(--accent-primary-text) xl:text-base"
					leftIcon={<Icon className="size-4" />}
					size="custom"
					variant="mobile"
					onClick={action}
				>
					{title}
				</Button>
			))}
		</div>
	);
});
