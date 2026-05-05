import { useState } from 'react';
import { PanelLeft } from 'lucide-react';

// import { useStore } from '@/app/providers';
import { IconLogo } from '@/shared/assets/images';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui';

import { TabsNav, UserButton, UserMenu } from '.';

export const Sidebar = () => {
	// const { userStore } = useStore();

	// if (!userStore.user) return;

	const [isOpen, setIsOpen] = useState(false);
	const [minimized, setMinimized] = useState(false);

	return (
		<div className={cn('mr-4 flex h-full w-fit flex-col gap-4 overflow-hidden ease-in-out', minimized ? '' : '')}>
			<div
				className={cn(
					'flex w-full items-center gap-2 transition-[width] duration-500',
					minimized ? 'w-12' : 'w-60'
				)}
			>
				<div
					className="group relative flex cursor-pointer items-center justify-center"
					onClick={() => {
						if (minimized) setMinimized((prev) => !prev);
					}}
				>
					<img className="w-11 min-w-11 transition-opacity duration-200" src={IconLogo} />
					{minimized && (
						<PanelLeft className="absolute size-6 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
					)}
				</div>
				<div
					className={cn(
						'flex h-full flex-col justify-end gap-2 transition-opacity',
						minimized ? 'opacity-0 duration-100' : 'opacity-100 delay-500 duration-500'
					)}
				>
					<h1 className="text-3xl leading-4 font-semibold">
						Tool<span className="text-[#5b5cff]">Box</span>
					</h1>
					<h2 className="text-xs leading-4 text-(--color-disabled)">Ваш набор инструментов</h2>
				</div>
				<Button
					centerIcon={
						<PanelLeft className="size-6 text-(--color-disabled) hover:text-(--accent-primary-hover)" />
					}
					className="ml-auto"
					size="custom"
					variant="mobile"
					onClick={() => setMinimized((prev) => !prev)}
				/>
			</div>
			<div className="flex flex-1 flex-col justify-between gap-4 shadow-(--shadow)">
				<TabsNav minimized={minimized} />
				<div className="relative">
					<UserButton minimized={minimized} onClick={() => setIsOpen((prev) => !prev)} />
					<UserMenu isOpen={isOpen} setIsOpen={setIsOpen} />
				</div>
			</div>
		</div>
	);
};
