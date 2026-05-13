import type { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';

import { useDeviceType } from '@/shared/lib/hooks';
import { cn } from '@/shared/lib/utils';

interface LayoutProps {
	leftSide?: ReactNode;
	hideLeftOnMobile?: boolean;
	children?: ReactNode;
}

export function Layout({ hideLeftOnMobile = false, leftSide }: LayoutProps) {
	const device = useDeviceType();

	const left = hideLeftOnMobile && device === 'mobile' ? null : leftSide;

	return (
		<div
			className={cn(
				'mx-auto flex h-dvh min-h-0 w-full flex-1 flex-col overflow-hidden',
				left ? 'py-4 pr-4' : 'p-4'
			)}
		>
			<div className="flex min-h-0 flex-1 overflow-hidden">
				{left && <aside className="h-full">{left}</aside>}
				<main className="flex min-h-0 flex-1">
					<Outlet />
				</main>
			</div>
		</div>
	);
}
