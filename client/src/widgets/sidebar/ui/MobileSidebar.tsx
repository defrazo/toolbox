import { useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import { Menu } from 'lucide-react';

import { useBodyScrollLock } from '@/shared/lib/hooks';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui';

import { TabsNav, UserButton } from '.';

export const MobileSidebar = () => {
	const [open, setOpen] = useState<boolean>(false);
	const handlers = useSwipeable({ onSwipedLeft: () => setOpen(false), delta: 50, trackTouch: true });

	useBodyScrollLock(open);

	return (
		<>
			<Button
				centerIcon={<Menu className="size-7" />}
				className="absolute top-0 right-0 z-50 rounded-2xl rounded-tl-none rounded-br-none border border-(--border-color) bg-(--bg-secondary) p-2 shadow-md lg:hidden"
				variant="custom"
				onClick={() => setOpen(true)}
			/>
			<div
				className={cn(
					'fixed inset-0 z-40 bg-(--bg-overlay) transition-opacity duration-300',
					open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
				)}
				onClick={() => setOpen(false)}
			/>
			<div
				{...handlers}
				className={cn(
					'fixed top-0 bottom-0 left-0 z-50 w-64 transform overflow-y-auto bg-(--bg-mobile-sidebar) py-4 shadow-lg transition-transform duration-300',
					open ? 'translate-x-0' : '-translate-x-full'
				)}
			>
				<div className="relative flex flex-col justify-between gap-4 px-4">
					<UserButton />
					<TabsNav />
				</div>
			</div>
		</>
	);
};
