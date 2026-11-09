import { type ComponentType, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Home, Link, type LucideIcon, Settings } from 'lucide-react';
import { observer } from 'mobx-react-lite';

import { useStore } from '@/app/providers';
import { type Layout, type ToolId, TOOLS } from '@/entities/tool';
import {
	TabCompare,
	TabHome,
	type TabId,
	TabImages,
	TabLinks,
	TabRenamer,
	TabSettings,
	TabShortener,
} from '@/features/tabs';
import type { TabLayoutProps } from '@/features/tabs/model/types';
import { usePageTitle } from '@/shared/lib/hooks';
import { cn } from '@/shared/lib/utils';

import { TabFooter } from './TabFooter';
import { TabTitle } from './TabTitle';

type TabConfig = {
	component: ComponentType<TabLayoutProps>;
	title: string;
	subtitle: string;
	icon: LucideIcon;
	layout: Layout;
};

type TabLayoutState = {
	tab: TabId;
	owner: object;
	layout: Layout | null;
};

const LAYOUT_CLASSES: Record<Layout, string> = {
	page: 'lg:p-6 2xl:p-12 lg:justify-between',
	workspace: 'lg:max-w-3xl lg:p-6 ',
	screen: 'lg:h-full lg:max-w-3xl lg:p-6',
	fullscreen: 'lg:h-full lg:p-6 lg:justify-between',
};

const TabContainer = observer(() => {
	const { t: tHome } = useTranslation('home');
	const { t: tImages } = useTranslation('images');
	const { t: tShortener } = useTranslation('shortener');
	const { t: tCompare } = useTranslation('compare');
	const { t: tSettings } = useTranslation('settings');
	const { t: tRenamer } = useTranslation('renamer');
	const { t: tLinks } = useTranslation('links');

	const { tabsStore } = useStore();

	const toolTabs: Record<ToolId, TabConfig> = {
		images: {
			component: TabImages,
			title: tImages(($) => $.meta.title),
			subtitle: tImages(($) => $.meta.pageSubtitle),
			icon: TOOLS.images.icon,
			layout: TOOLS.images.layout,
		},
		shortener: {
			component: TabShortener,
			title: tShortener(($) => $.meta.title),
			subtitle: tShortener(($) => $.meta.pageSubtitle),
			icon: TOOLS.shortener.icon,
			layout: TOOLS.shortener.layout,
		},
		compare: {
			component: TabCompare,
			title: tCompare(($) => $.meta.title),
			subtitle: tCompare(($) => $.meta.pageSubtitle),
			icon: TOOLS.compare.icon,
			layout: TOOLS.compare.layout,
		},
		renamer: {
			component: TabRenamer,
			title: tRenamer(($) => $.meta.title),
			subtitle: tRenamer(($) => $.meta.pageSubtitle),
			icon: TOOLS.renamer.icon,
			layout: TOOLS.renamer.layout,
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
		links: {
			component: TabLinks,
			title: tLinks(($) => $.meta.title),
			subtitle: tLinks(($) => $.meta.subtitle),
			icon: Link,
			layout: 'fullscreen',
		},
		settings: {
			component: TabSettings,
			title: tSettings(($) => $.meta.title),
			subtitle: tSettings(($) => $.meta.subtitle),
			icon: Settings,
			layout: 'workspace',
		},
		...toolTabs,
	};

	const activeTab = tabsStore.tab;
	const { component: TabComponent, title, subtitle, icon, layout } = TABS[activeTab];
	const [tabLayout, setTabLayout] = useState<TabLayoutState>(() => ({ tab: activeTab, owner: {}, layout: null }));

	if (tabLayout.tab !== activeTab) setTabLayout({ tab: activeTab, owner: {}, layout: null });

	const owner = tabLayout.owner;
	const onLayoutChange = useCallback(
		(nextLayout: Layout | null) => {
			setTabLayout((current) => {
				if (current.owner !== owner || current.tab !== activeTab || current.layout === nextLayout)
					return current;
				return { ...current, layout: nextLayout };
			});
		},
		[activeTab, owner]
	);
	const effectiveLayout = tabLayout.tab === activeTab ? (tabLayout.layout ?? layout) : layout;

	usePageTitle(title);

	useEffect(() => {
		const tab = document.getElementById('tab-scroll');
		if (!tab) return;

		tab.scrollTo({ top: 0, left: 0, behavior: 'instant' });

		requestAnimationFrame(() => tab.scrollTo({ top: 0, left: 0, behavior: 'instant' }));
	}, [activeTab]);

	return (
		<div
			className={cn(
				'core-border relative z-0 size-full min-h-0 cursor-default overflow-hidden bg-(--bg-global) shadow-(--shadow)',
				activeTab === 'images' && 'min-w-0 contain-[inline-size]'
			)}
		>
			<div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
				<div className="absolute top-0 right-0 size-100 translate-x-1/2 -translate-y-1/2 rounded-full bg-(--bg-blob)/40 blur-[120px]" />
				{(effectiveLayout === 'workspace' || effectiveLayout === 'screen') && (
					<div className="absolute bottom-0 left-0 size-100 -translate-x-1/2 translate-y-1/2 rounded-full bg-(--bg-blob)/40 blur-[120px]" />
				)}
				{effectiveLayout !== 'page' && (
					<div className="bottom-0 left-0 hidden size-100 -translate-x-1/2 translate-y-1/2 rounded-full bg-(--bg-blob)/40 blur-[120px] xl:absolute" />
				)}
			</div>
			<div
				className={cn(
					'hide-scrollbar relative z-20 flex size-full min-h-0 flex-col overflow-x-hidden overflow-y-auto [-webkit-overflow-scrolling:touch]',
					activeTab === 'images' && 'xl:overflow-y-hidden'
				)}
				id="tab-scroll"
			>
				<div
					className={cn(
						'relative flex w-full flex-1 flex-col gap-4 p-3 lg:mx-auto lg:gap-6 2xl:gap-8',
						LAYOUT_CLASSES[effectiveLayout],
						activeTab === 'images' && 'lg:h-auto lg:justify-start xl:h-full xl:min-h-0 xl:overflow-hidden'
					)}
				>
					{activeTab === 'images' ? (
						<div className="shrink-0">
							<TabTitle icon={icon} subtitle={subtitle} title={title} />
						</div>
					) : (
						activeTab !== 'home' && <TabTitle icon={icon} subtitle={subtitle} title={title} />
					)}
					<TabComponent onLayoutChange={onLayoutChange} />
				</div>
				{activeTab === 'home' && <TabFooter />}
			</div>
		</div>
	);
});

export default TabContainer;
