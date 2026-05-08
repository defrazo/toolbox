import { FolderPen, House, LifeBuoy, Link, LucideIcon, Settings } from 'lucide-react';
import { observer } from 'mobx-react-lite';

import { useStore } from '@/app/providers';
import { TabId } from '@/features/tabs';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui';

const TABS: ReadonlyArray<{ id: TabId; title: string; icon: LucideIcon }> = [
	{ id: 'home', title: 'Главная', icon: House },
	{ id: 'renamer', title: 'Переименовать файлы', icon: FolderPen },
	{ id: 'shortener', title: 'Сократить ссылку', icon: Link },
	{ id: 'settings', title: 'Настройки', icon: Settings },
	{ id: 'help', title: 'Справка', icon: LifeBuoy },
];

export const TabsNav = observer(({ onTabClick, minimized }: { minimized?: boolean; onTabClick?: () => void }) => {
	const { tabsStore } = useStore();

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
								'core-border h-12 justify-start bg-(--bg-secondary) p-3 leading-4 shadow-(--shadow) transition duration-200 ease-out hover:-translate-y-px hover:border-(--accent-primary-hover) hover:shadow-(--shadow-primary)',
								'transition-[width] duration-500',
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
