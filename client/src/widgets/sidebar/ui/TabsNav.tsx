import { useTranslation } from 'react-i18next';
import { FolderPen, House, LifeBuoy, Link, type LucideIcon, Settings } from 'lucide-react';
import { observer } from 'mobx-react-lite';

import { useStore } from '@/app/providers';
import { TabId } from '@/features/tabs';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui';

export const TabsNav = observer(({ onTabClick, minimized }: { minimized?: boolean; onTabClick?: () => void }) => {
	const { t } = useTranslation('nav');

	const { tabsStore } = useStore();

	const TABS: ReadonlyArray<{ id: TabId; title: string; icon: LucideIcon }> = [
		{ id: 'home', title: t(($) => $.sidebar.items.home), icon: House },
		{ id: 'renamer', title: t(($) => $.sidebar.items.renamer), icon: FolderPen },
		{ id: 'shortener', title: t(($) => $.sidebar.items.shortener), icon: Link },
		{ id: 'settings', title: t(($) => $.sidebar.items.settings), icon: Settings },
		{ id: 'help', title: t(($) => $.sidebar.items.help), icon: LifeBuoy },
	];

	const handleClick = (tab: TabId) => {
		tabsStore.setTab(tab);
		onTabClick?.();
	};

	return (
		<>
			<div className="flex flex-col gap-3">
				{TABS.filter((tab) => tab.id !== 'settings' && tab.id !== 'help').map(({ id, title, icon: Icon }) => {
					return (
						<Button
							key={id}
							className={cn(
								'core-border h-12 justify-start bg-(--bg-secondary) p-3 leading-4 shadow-(--shadow) transition-all duration-500 ease-out hover:-translate-y-px hover:border-(--accent-primary-hover) hover:shadow-(--shadow-primary)',
								minimized ? 'w-12' : 'w-60',
								tabsStore.tab === id && 'bg-(image:--gradient-primary)'
							)}
							leftIcon={<Icon className="size-5 text-(--accent-primary-text)" />}
							size="custom"
							onClick={() => handleClick(id)}
						>
							<span
								className={cn(
									'overflow-hidden whitespace-nowrap text-(--accent-primary-text) transition-opacity duration-500',
									minimized ? 'opacity-0' : 'opacity-100'
								)}
							>
								{title}
							</span>
						</Button>
					);
				})}
			</div>
		</>
	);
});
