import type { ComponentType } from 'react';
import { useTranslation } from 'react-i18next';
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

const TabContainer = observer(() => {
	const { t: tHome } = useTranslation('home');
	const { t: tSettings } = useTranslation('settings');
	const { t: tHelp } = useTranslation('help');
	const { t: tRenamer } = useTranslation('renamer');
	const { t: tShortener } = useTranslation('shortener');

	const { tabsStore } = useStore();

	const toolTabs: Record<ToolId, TabConfig> = {
		renamer: {
			component: TabRenamer,
			title: tRenamer(($) => $.meta.pageTitle),
			subtitle: tRenamer(($) => $.meta.pageSubtitle),
			icon: TOOLS.find((tool) => tool.id === 'renamer')!.icon,
			layout: 'tool',
		},
		shortener: {
			component: TabShortener,
			title: tShortener(($) => $.meta.pageTitle),
			subtitle: tShortener(($) => $.meta.pageSubtitle),
			icon: TOOLS.find((tool) => tool.id === 'shortener')!.icon,
			layout: 'tool',
		},
	};

	const TABS: Record<TabId, TabConfig> = {
		home: {
			component: TabHome,
			title: tHome(($) => $.meta.title),
			subtitle: tHome(($) => $.meta.subtitle),
			icon: Home,
			layout: 'page',
		},
		settings: {
			component: TabSettings,
			title: tSettings(($) => $.meta.title),
			subtitle: tSettings(($) => $.meta.subtitle),
			icon: Settings,
			layout: 'tool',
		},
		help: {
			component: TabHelp,
			title: tHelp(($) => $.meta.title),
			subtitle: tHelp(($) => $.meta.subtitle),
			icon: LifeBuoy,
			layout: 'page',
		},
		...toolTabs,
	};

	const activeTab = tabsStore.tab;
	const { component: TabComponent, title, subtitle, icon, layout } = TABS[activeTab ?? 'home'];

	usePageTitle(title);

	return (
		<div className="hide-scrollbar core-border relative z-0 flex size-full min-h-0 cursor-default flex-col overflow-x-hidden overflow-y-auto bg-(--bg-global) shadow-(--shadow)">
			<div
				className={cn(
					'z-10 mx-auto flex size-full flex-col gap-8',
					layout === 'tool' ? 'max-w-3xl p-6' : 'justify-between p-12'
				)}
			>
				{activeTab !== 'home' && <TabTitle icon={icon} subtitle={subtitle} title={title} />}
				<TabComponent />
			</div>
			{activeTab === 'home' && <TabFooter />}
			{layout === 'tool' ? (
				<>
					<div className="absolute top-0 right-0 size-100 translate-x-1/2 -translate-y-1/2 rounded-full bg-[#7a5cff]/40 blur-[120px]" />
					<div className="absolute bottom-0 left-0 size-100 -translate-x-1/2 translate-y-1/2 rounded-full bg-[#7a5cff]/40 blur-[120px]" />
				</>
			) : (
				<div className="absolute top-0 right-0 size-100 translate-x-1/2 -translate-y-1/2 rounded-full bg-[#7a5cff]/40 blur-[120px]" />
			)}
		</div>
	);
});

export default TabContainer;
