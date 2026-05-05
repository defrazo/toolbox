import { useEffect, useRef } from 'react';
import { LifeBuoy, LogOut, Settings } from 'lucide-react';
import { observer } from 'mobx-react-lite';

import { useStore } from '@/app/providers';
import { Button, Divider } from '@/shared/ui';

export const UserMenu = observer(
	({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: React.Dispatch<React.SetStateAction<boolean>> }) => {
		const { tabsStore, userStore, authStore } = useStore();
		const menuRef = useRef<HTMLDivElement>(null);

		const navButtons = [
			{
				title: 'Настройки',
				icon: Settings,
				action: () => {
					tabsStore.setTab('settings');
					setIsOpen(false);
				},
			},
			{
				title: 'Справка',
				icon: LifeBuoy,
				action: () => {
					tabsStore.setTab('help');
					setIsOpen(false);
				},
			},
			{ title: 'Выйти', icon: LogOut, action: () => authStore.logout() },
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
				className="animate-in fade-in slide-in-from-bottom-2 absolute bottom-full left-0 z-30 mb-2 flex w-60 flex-col gap-1 rounded-xl border border-(--border-color) bg-(--bg-secondary) p-2 shadow-lg"
			>
				<div className="px-2 py-1 text-sm text-(--color-disabled)">
					{userStore.username} ({userStore.email})
				</div>
				<Divider />
				{navButtons.map(({ title, icon: Icon, action }) => {
					return (
						<>
							{title === 'Выйти' && <Divider />}
							<Button
								className="justify-start rounded-xl px-2 py-0.5 text-left hover:border-(--accent-primary-hover) hover:bg-(--bg-secondary) hover:text-(--color-accent)"
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
	}
);
