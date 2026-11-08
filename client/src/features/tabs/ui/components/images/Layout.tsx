import type { ReactNode } from 'react';

import { cn } from '@/shared/lib/utils';

interface LayoutProps {
	tabs: ReactNode;
	children: ReactNode;
	settings?: ReactNode;
}

export const Layout = ({ tabs, children, settings }: LayoutProps) => (
	<div className="flex min-w-0 flex-col gap-3 xl:min-h-0 xl:flex-1 xl:overflow-hidden">
		<div className="min-w-0 shrink-0">{tabs}</div>
		<div
			className={cn(
				'grid min-h-0 min-w-0 flex-1 grid-cols-1 gap-3 xl:grid-rows-[minmax(0,1fr)] xl:overflow-hidden',
				settings && 'xl:grid-cols-[minmax(0,1fr)_20rem]'
			)}
		>
			<div className="flex min-w-0 scrollbar-none flex-col xl:min-h-0 xl:overflow-y-auto">{children}</div>
			{settings && <aside className="flex min-h-0 min-w-0 flex-col overflow-y-auto">{settings}</aside>}
		</div>
	</div>
);
