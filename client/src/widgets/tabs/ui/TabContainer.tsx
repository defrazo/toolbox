import type { ComponentType } from 'react';
import { Home, LifeBuoy, type LucideIcon, Settings } from 'lucide-react';
import { observer } from 'mobx-react-lite';

import { useStore } from '@/app/providers';
import { type Layout, type ToolId, TOOLS } from '@/entities/tool';
import { TabHelp, TabHome, type TabId, TabRenamer, TabSettings, TabShortener } from '@/features/tabs';
import { usePageTitle } from '@/shared/lib/hooks';
import { cn } from '@/shared/lib/utils';

import { TabFooter, TabTitle } from '.';

type TabConfig = {
	component: ComponentType;
	title: string;
	subtitle: string;
	icon: LucideIcon;
	layout: Layout;
};

const TabTool: Record<ToolId, ComponentType> = {
	renamer: TabRenamer,
	shortener: TabShortener,
};

const TABS: Record<TabId, TabConfig> = {
	home: {
		component: TabHome,
		title: 'Главная',
		subtitle: 'Начните работу с инструментами',
		icon: Home,
		layout: 'page',
	},
	settings: {
		component: TabSettings,
		title: 'Настройки',
		subtitle: 'Настройте приложение под себя',
		icon: Settings,
		layout: 'tool',
	},
	help: {
		component: TabHelp,
		title: 'Справка',
		subtitle: 'Узнайте больше о своих инструментах',
		icon: LifeBuoy,
		layout: 'page',
	},
	...(Object.fromEntries(
		TOOLS.map((tool) => [
			tool.id,
			{
				component: TabTool[tool.id],
				title: tool.title,
				subtitle: tool.subtitle,
				icon: tool.icon,
				layout: tool.layout,
			},
		])
	) as Record<ToolId, TabConfig>),
};

const TabContainer = observer(() => {
	const { tabsStore } = useStore();

	const activeTab = tabsStore.tab;
	const { component: TabComponent, title, subtitle, icon, layout } = TABS[activeTab ?? 'home'];

	usePageTitle(title);

	return (
		<div className="hide-scrollbar core-border flex size-full min-h-0 cursor-default flex-col overflow-auto bg-(--bg-global) shadow-(--shadow)">
			<div
				className={cn(
					'mx-auto flex size-full flex-col gap-8',
					layout === 'tool' ? 'max-w-3xl p-6' : 'justify-between p-12'
				)}
			>
				{activeTab !== 'home' && <TabTitle icon={icon} subtitle={subtitle} title={title} />}
				<TabComponent />
			</div>
			{activeTab === 'home' && <TabFooter />}
		</div>
	);
});

export default TabContainer;
