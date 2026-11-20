import type { ReactNode } from 'react';

import { cn } from '@/shared/lib/utils';

interface LayoutProps {
	tabs: ReactNode;
	children: ReactNode;
	settings?: ReactNode;
	toolbar?: ReactNode;
}

export const Layout = ({ tabs, children, settings, toolbar }: LayoutProps) => (
	<div
		className={cn(
			'grid min-w-0 grid-cols-1 gap-3 xl:min-h-0 xl:flex-1 xl:grid-rows-[auto_minmax(0,1fr)] xl:overflow-hidden',
			settings && 'xl:grid-cols-[minmax(0,1fr)_20rem]'
		)}
	>
		<div className="min-w-0 xl:col-start-1 xl:row-start-1">{tabs}</div>
		{toolbar && <div className="min-w-0 xl:col-start-2 xl:row-start-1">{toolbar}</div>}
		<div className="flex min-w-0 scrollbar-none flex-col xl:col-start-1 xl:row-start-2 xl:min-h-0 xl:overflow-y-auto">
			{children}
		</div>
		{settings && (
			<aside className="flex min-h-0 min-w-0 flex-col gap-3 overflow-hidden xl:col-start-2 xl:row-start-2">
				{settings}
			</aside>
		)}
	</div>
);
