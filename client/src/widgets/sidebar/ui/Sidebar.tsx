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
		<div className={cn('flex h-full w-fit flex-col gap-4 px-4 ease-in-out', minimized ? '' : '')}>
			<div
				className={cn(
					'flex h-12 w-full items-center gap-2 transition-[width] duration-500',
					minimized ? 'w-12' : 'w-60'
				)}
			>
				<div
					className="group relative flex h-12 cursor-pointer items-center justify-center"
					onClick={() => {
						if (minimized) setMinimized((prev) => !prev);
					}}
				>
					<img
						className={cn(
							'w-12 min-w-12 transition-opacity duration-200',
							minimized && 'group-hover:opacity-0'
						)}
						src={IconLogo}
					/>
					{minimized && (
						<Button
							centerIcon={<PanelLeft className="size-8" />}
							className="absolute rounded-xl p-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
							size="custom"
							title="Развернуть боковую панель"
						/>
					)}
				</div>
				<div
					className={cn(
						'flex h-full flex-col justify-end gap-2 transition-opacity select-none',
						minimized ? 'opacity-0 duration-100' : 'opacity-100 delay-500 duration-500'
					)}
				>
					<h1 className="text-3xl leading-4 font-semibold">
						<span className="text-(--accent-primary-text)">Tool</span>
						<span className="text-(--color-accent)">Box</span>
					</h1>
					<h2 className="text-xs leading-4 text-(--color-disabled)">Ваш набор инструментов</h2>
				</div>
				<Button
					centerIcon={
						<PanelLeft className="size-6 text-(--color-disabled) hover:text-(--accent-primary-hover)" />
					}
					className="ml-auto"
					size="custom"
					title="Свернуть боковую панель"
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
