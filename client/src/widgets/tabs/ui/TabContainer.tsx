import { type ComponentType, useEffect } from 'react';
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

const LAYOUT_CLASSES: Record<Layout, string> = {
	page: 'lg:p-6 2xl:p-12 lg:justify-between',
	workspace: 'lg:max-w-3xl lg:p-6 ',
	screen: 'lg:h-full lg:max-w-3xl lg:p-6',
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
			icon: TOOLS.renamer.icon,
			layout: TOOLS.renamer.layout,
		},
		shortener: {
			component: TabShortener,
			title: tShortener(($) => $.meta.pageTitle),
			subtitle: tShortener(($) => $.meta.pageSubtitle),
			icon: TOOLS.shortener.icon,
			layout: TOOLS.shortener.layout,
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
			layout: 'workspace',
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
	const { component: TabComponent, title, subtitle, icon, layout } = TABS[activeTab];

	usePageTitle(title);

	useEffect(() => {
		const tab = document.getElementById('tab-scroll');
		if (!tab) return;

		tab.scrollTo({ top: 0, left: 0, behavior: 'instant' });

		requestAnimationFrame(() => tab.scrollTo({ top: 0, left: 0, behavior: 'instant' }));
	}, [activeTab]);

	return (
		<div className="core-border relative z-0 size-full min-h-0 cursor-default overflow-hidden bg-(--bg-global) shadow-(--shadow)">
			<div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
				<div className="absolute top-0 right-0 size-100 translate-x-1/2 -translate-y-1/2 rounded-full bg-(--bg-blob)/40 blur-[120px]" />
				{layout !== 'page' && (
					<div className="bottom-0 left-0 hidden size-100 -translate-x-1/2 translate-y-1/2 rounded-full bg-(--bg-blob)/40 blur-[120px] xl:absolute" />
				)}
			</div>
			<div
				className="hide-scrollbar relative z-20 flex size-full min-h-0 flex-col overflow-x-hidden overflow-y-auto [-webkit-overflow-scrolling:touch]"
				id="tab-scroll"
			>
				<div
					className={cn(
						'flex w-full flex-1 flex-col gap-4 p-3 lg:mx-auto lg:gap-6 2xl:gap-8',
						LAYOUT_CLASSES[layout]
					)}
				>
					{activeTab !== 'home' && <TabTitle icon={icon} subtitle={subtitle} title={title} />}
					<TabComponent />
				</div>
				{activeTab === 'home' && <TabFooter />}
			</div>
		</div>
	);
});

export default TabContainer;
