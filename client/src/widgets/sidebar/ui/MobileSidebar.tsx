import { useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import { Menu } from 'lucide-react';

import { useBodyScrollLock } from '@/shared/lib/hooks';
import { cn } from '@/shared/lib/utils';
import { Button, Logo } from '@/shared/ui';

import { useUserMenu } from '../model';
import { TabsNav, UserButton, UserMenu } from '.';

export const MobileSidebar = () => {
	const { isMenuOpen, setIsMenuOpen, buttonRef, toggle } = useUserMenu();

	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const handlers = useSwipeable({ onSwipedLeft: () => setIsSidebarOpen(false), delta: 50, trackTouch: true });

	useBodyScrollLock(isSidebarOpen);

	return (
		<>
			<Button
				centerIcon={<Menu className="size-7" />}
				className="absolute top-0 right-0 z-50 rounded-2xl rounded-tl-none rounded-br-none border border-(--border-color) bg-(--bg-secondary) p-2 shadow-md backdrop-blur-md lg:hidden"
				variant="custom"
				onClick={() => setIsSidebarOpen(true)}
			/>
			<div
				className={cn(
					'fixed inset-0 z-40 bg-(--bg-overlay) transition-opacity duration-300',
					isSidebarOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
				)}
				onClick={() => setIsSidebarOpen(false)}
			/>
			<div
				className={cn(
					'fixed top-0 bottom-0 left-0 z-50 w-64 transform overflow-y-auto bg-(--bg-mobile-sidebar) p-4 shadow-lg transition-transform duration-300',
					isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
				)}
				{...handlers}
			>
				<div className="relative flex h-full flex-col gap-4">
					<Logo setIsSidebarOpen={setIsSidebarOpen} />
					<TabsNav onTabClick={() => setIsSidebarOpen(false)} />
					<div className="relative mt-auto">
						<UserMenu
							isMenuOpen={isMenuOpen}
							setIsMenuOpen={setIsMenuOpen}
							setIsSidebarOpen={setIsSidebarOpen}
							triggerRef={buttonRef}
						/>
						<UserButton ref={buttonRef} isMenuOpen={isMenuOpen} setIsMenuOpen={toggle} />
					</div>
				</div>
			</div>
		</>
	);
};
