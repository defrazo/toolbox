import type { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';

import { useDeviceType } from '@/shared/lib/hooks';
import { cn } from '@/shared/lib/utils';

interface LayoutProps {
	leftSide?: ReactNode;
	hideLeftOnMobile?: boolean;
	variant?: 'default' | 'auth';
}

export function Layout({ hideLeftOnMobile = false, leftSide, variant = 'default' }: LayoutProps) {
	const device = useDeviceType();
	const left = hideLeftOnMobile && device === 'mobile' ? null : leftSide;

	return (
		<div className="mx-auto flex h-dvh min-h-0 w-full flex-1 flex-col overflow-hidden p-4">
			<div className="flex min-h-0 flex-1 overflow-hidden">
				{left && (
					<aside
						className={cn(
							'h-full',
							variant === 'auth' && 'rounded-l-xl border border-r-0 border-(--border-color)'
						)}
					>
						{left}
					</aside>
				)}
				<main
					className={cn(
						'flex min-h-0 min-w-0 flex-1 overflow-hidden rounded-xl border border-(--border-color)',
						variant === 'auth' && left && 'rounded-l-none'
					)}
				>
					<Outlet />
				</main>
			</div>
		</div>
	);
}
