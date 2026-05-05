import { FolderPen, House, LifeBuoy, Link, LucideIcon, Settings } from 'lucide-react';
import { observer } from 'mobx-react-lite';

import { useStore } from '@/app/providers';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui';
import type { TabId } from '@/widgets/tabs';

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
								'justify-start rounded-xl border border-(--border-color) bg-(--bg-secondary) p-3 leading-4 shadow-(--shadow) hover:border-(--accent-primary-hover) hover:shadow-md',
								'transition-[width] duration-500',
								minimized ? 'w-12' : 'w-60',
								tabsStore.tab === id &&
									'bg-linear-to-br from-[#5b5cff] via-[#7a5cff] to-[#4da3ff] hover:shadow-[0_6px_30px_rgba(91,92,255,0.45),0_0_25px_rgba(77,163,255,0.35)]'
							)}
							leftIcon={<Icon className="size-5" />}
							size="custom"
							onClick={() => handleClick(id)}
						>
							<span
								className={cn(
									'overflow-hidden whitespace-nowrap transition-opacity duration-500',
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
