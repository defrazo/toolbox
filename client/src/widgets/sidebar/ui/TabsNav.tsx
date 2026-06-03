import { useTranslation } from 'react-i18next';
import { FolderPen, House, Link } from 'lucide-react';
import { observer } from 'mobx-react-lite';

import { useStore } from '@/app/providers';
import { TabId } from '@/features/tabs';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui';

const MAIN_TABS = [
	{ id: 'home', titleKey: 'home', icon: House },
	{ id: 'renamer', titleKey: 'renamer', icon: FolderPen },
	{ id: 'shortener', titleKey: 'shortener', icon: Link },
] as const;

export const TabsNav = observer(({ isMinimized, onTabClick }: { isMinimized?: boolean; onTabClick?: () => void }) => {
	const { t } = useTranslation('nav');

	const { tabsStore } = useStore();

	const handleClick = (tab: TabId) => {
		tabsStore.setTab(tab);
		onTabClick?.();
	};

	return (
		<nav className="flex flex-col gap-3">
			{MAIN_TABS.map(({ id, titleKey, icon: Icon }) => {
				const isActive = tabsStore.tab === id;

				return (
					<Button
						key={id}
						className={cn(
							'core-border h-12 justify-start bg-(--bg-secondary) p-3 text-sm shadow-(--shadow) transition-all duration-500 ease-out hover:-translate-y-px hover:border-(--accent-primary-hover) xl:text-base',
							isMinimized ? 'w-12' : 'xl:w-60',
							isActive && 'bg-(image:--gradient-primary)'
						)}
						leftIcon={<Icon className="size-5 text-(--accent-primary-text)" />}
						size="custom"
						onClick={() => handleClick(id)}
					>
						<span
							className={cn(
								'overflow-hidden whitespace-nowrap text-(--accent-primary-text) transition-opacity duration-500',
								isMinimized ? 'opacity-0' : 'opacity-100'
							)}
						>
							{t(($) => $.sidebar.items[titleKey])}
						</span>
					</Button>
				);
			})}
		</nav>
	);
});
