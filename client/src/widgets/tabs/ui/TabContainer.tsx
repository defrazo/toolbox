import type { ComponentType } from 'react';
import { FolderPen, Home, LifeBuoy, Link, LucideIcon, Settings } from 'lucide-react';
import { observer } from 'mobx-react-lite';

import { useStore } from '@/app/providers';
import { usePageTitle } from '@/shared/lib/hooks';

import type { TabId } from '../model';
import { TabHelp, TabHome, TabRenamer, TabSettings, TabShortener, TabTitle } from '.';

type TabConfig = {
	component: ComponentType;
	title: string;
	subtitle: string;
	icon: LucideIcon;
};

const TabContainer = observer(() => {
	const { tabsStore } = useStore();

	const TABS: Record<TabId, TabConfig> = {
		home: {
			component: TabHome,
			title: 'Главная',
			subtitle: 'Начните работу с инструментами',
			icon: Home,
		},
		renamer: {
			component: TabRenamer,
			title: 'Переименовать файлы',
			subtitle: 'Массовое переименование файлов',
			icon: FolderPen,
		},
		shortener: {
			component: TabShortener,
			title: 'Сократить ссылку',
			subtitle: 'Быстрое сокращение ссылок',
			icon: Link,
		},
		settings: {
			component: TabSettings,
			title: 'Настройки',
			subtitle: 'Настройте приложение под себя',
			icon: Settings,
		},
		help: {
			component: TabHelp,
			title: 'Справка',
			subtitle: 'Узнайте больше о своих инструментах',
			icon: LifeBuoy,
		},
	};

	const activeTab = tabsStore.tab;
	const { component: TabComponent, title, subtitle, icon } = TABS[activeTab];

	usePageTitle(title);

	return (
		<div className="hide-scrollbar core-border flex min-h-0 w-full flex-1 cursor-default flex-col gap-4 bg-[#121212] p-3 shadow-(--shadow) md:p-6">
			<section className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-4">
				<TabTitle icon={icon} subtitle={subtitle} title={title} />
				<TabComponent />
			</section>
		</div>
	);
});

export default TabContainer;
