import { useEffect } from 'react';

import type { Layout } from '@/entities/tool';
import { usePageTitle } from '@/shared/lib/hooks';
import { cn } from '@/shared/lib/utils';

import type { TabScreenDefinition } from '../model/types';
import { TabTitle } from './components';

const LAYOUT_CLASSES: Record<Layout, string> = {
	page: 'lg:p-6 2xl:p-12 lg:justify-between',
	workspace: 'lg:max-w-3xl lg:p-6 ',
	screen: 'lg:h-full lg:max-w-3xl lg:p-6',
	fullscreen: 'lg:h-full lg:p-6 lg:justify-between',
};

const TabContainer = ({ activeTab, screen }: { activeTab: string; screen: TabScreenDefinition }) => {
	const { component: TabComponent, title, subtitle, icon, layout, presentation, footer } = screen;

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
				'relative z-0 size-full min-h-0 cursor-default overflow-hidden bg-(--bg-global) shadow-(--shadow)',
				presentation?.containedDesktopScroll && 'min-w-0 contain-[inline-size]'
			)}
		>
			<div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
				<div className="absolute top-0 right-0 size-100 translate-x-1/2 -translate-y-1/2 rounded-full bg-(--bg-blob)/40 blur-[120px]" />
				{(layout === 'workspace' || layout === 'screen') && (
					<div className="absolute bottom-0 left-0 size-100 -translate-x-1/2 translate-y-1/2 rounded-full bg-(--bg-blob)/40 blur-[120px]" />
				)}
				{layout !== 'page' && (
					<div className="bottom-0 left-0 hidden size-100 -translate-x-1/2 translate-y-1/2 rounded-full bg-(--bg-blob)/40 blur-[120px] xl:absolute" />
				)}
			</div>
			<div
				className={cn(
					'hide-scrollbar relative z-20 flex size-full min-h-0 flex-col overflow-x-hidden overflow-y-auto [-webkit-overflow-scrolling:touch]',
					presentation?.containedDesktopScroll && 'xl:overflow-y-hidden'
				)}
				id="tab-scroll"
			>
				<div
					className={cn(
						'relative flex w-full flex-1 flex-col gap-4 p-3 lg:mx-auto lg:gap-6 2xl:gap-8',
						LAYOUT_CLASSES[layout],
						presentation?.containedDesktopScroll &&
							'lg:h-auto lg:justify-start xl:h-full xl:min-h-0 xl:overflow-hidden'
					)}
				>
					{presentation?.title === 'fixed' ? (
						<div className="shrink-0">
							<TabTitle icon={icon} subtitle={subtitle} title={title} />
						</div>
					) : (
						presentation?.title !== 'hidden' && <TabTitle icon={icon} subtitle={subtitle} title={title} />
					)}
					<TabComponent />
				</div>
				{footer}
			</div>
		</div>
	);
};

export default TabContainer;
