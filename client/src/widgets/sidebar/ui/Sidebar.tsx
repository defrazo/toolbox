import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PanelLeft } from 'lucide-react';

import { IconLogo } from '@/shared/assets/images';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui';

import { useUserMenu } from '../model';
import { TabsNav, UserButton, UserMenu } from '.';

export const Sidebar = () => {
	const { t } = useTranslation('nav');

	const { isMenuOpen, setIsMenuOpen, buttonRef, toggle } = useUserMenu();

	const [isMinimized, setIsMinimized] = useState(false);

	return (
		<div className="flex h-full w-fit flex-col gap-4 pr-4 ease-in-out">
			<div
				className={cn(
					'flex h-12 w-full items-center gap-2 transition-[width] duration-500',
					isMinimized ? 'w-12' : 'w-60'
				)}
			>
				<div
					className="group relative flex h-12 cursor-pointer items-center justify-center"
					onClick={() => {
						if (isMinimized) setIsMinimized((prev) => !prev);
					}}
				>
					<img
						alt="ToolBox"
						className={cn(
							'w-12 min-w-12 transition-opacity duration-200',
							isMinimized && 'group-hover:opacity-0'
						)}
						src={IconLogo}
					/>
					{isMinimized && (
						<Button
							centerIcon={<PanelLeft className="size-6" />}
							className="absolute size-12 rounded-xl p-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
							size="custom"
							title={t(($) => $.tooltips.expand)}
						/>
					)}
				</div>
				<div
					className={cn(
						'flex h-full flex-col justify-end gap-2 transition-opacity select-none',
						isMinimized ? 'opacity-0 duration-100' : 'opacity-100 delay-500 duration-500'
					)}
				>
					<h1 className="text-3xl leading-4 font-semibold">
						<span className="text-(--accent-primary-text)">Tool</span>
						<span className="text-(--color-accent)">Box</span>
					</h1>
					<h2 className="text-xs leading-4 text-(--color-disabled)">{t(($) => $.sidebar.subtitle)}</h2>
				</div>
				<Button
					centerIcon={
						<PanelLeft className="size-6 text-(--color-disabled) hover:text-(--accent-primary-hover)" />
					}
					className="ml-auto"
					size="custom"
					title={t(($) => $.tooltips.collapse)}
					variant="mobile"
					onClick={() => setIsMinimized((prev) => !prev)}
				/>
			</div>
			<div className="flex flex-1 flex-col justify-between gap-4 shadow-(--shadow)">
				<TabsNav isMinimized={isMinimized} />
				<div className="relative">
					<UserMenu isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} triggerRef={buttonRef} />
					<UserButton
						ref={buttonRef}
						isMenuOpen={isMenuOpen}
						isMinimized={isMinimized}
						setIsMenuOpen={toggle}
					/>
				</div>
			</div>
		</div>
	);
};
