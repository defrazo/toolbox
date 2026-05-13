import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { LifeBuoy, LogOut, Mail, Settings } from 'lucide-react';
import { observer } from 'mobx-react-lite';

import { useStore } from '@/app/providers';
import { Button, Divider } from '@/shared/ui';

interface UserMenuProps {
	isOpen: boolean;
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const UserMenu = observer(({ isOpen, setIsOpen }: UserMenuProps) => {
	const { t } = useTranslation('nav');

	const { tabsStore, userStore, authStore } = useStore();

	const menuRef = useRef<HTMLDivElement>(null);

	const navButtons = [
		{
			title: t(($) => $.userMenu.settings),
			icon: Settings,
			action: () => {
				tabsStore.setTab('settings');
				setIsOpen(false);
			},
		},
		{
			title: t(($) => $.userMenu.help),
			icon: LifeBuoy,
			action: () => {
				tabsStore.setTab('help');
				setIsOpen(false);
			},
		},
		{ title: t(($) => $.userMenu.logout), icon: LogOut, action: () => authStore.logout() },
	];

	useEffect(() => {
		if (!isOpen) return;

		const handleClickOutside = (event: MouseEvent) => {
			if (menuRef.current && !menuRef.current.contains(event.target as Node)) setIsOpen(false);
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, [isOpen, setIsOpen]);

	if (!isOpen) return null;

	return (
		<div
			ref={menuRef}
			className="animate-in fade-in slide-in-from-bottom-2 core-border absolute bottom-full left-0 z-30 mb-2 flex w-60 flex-col gap-1 bg-(--bg-secondary) p-2 shadow-lg backdrop-blur-md"
		>
			<div className="flex cursor-default items-center gap-2 px-2 py-1 text-sm text-(--color-disabled)">
				<Mail className="size-4" />
				{userStore.email ? `${userStore.email}` : 'E-mail'}
			</div>
			<Divider />
			{navButtons.map(({ title, icon: Icon, action }) => {
				return (
					<>
						{Icon === LogOut && <Divider />}
						<Button
							className="justify-start rounded-lg px-2 py-0.5 text-left text-(--accent-primary-text) hover:bg-(--accent-primary-hover) hover:text-(--accent-primary-text)"
							leftIcon={<Icon className="size-4" />}
							size="custom"
							variant="mobile"
							onClick={action}
						>
							{title}
						</Button>
					</>
				);
			})}
		</div>
	);
});
