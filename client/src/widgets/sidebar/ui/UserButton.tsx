import { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronUp } from 'lucide-react';
import { observer } from 'mobx-react-lite';

import { useStore } from '@/app/providers';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui';

interface UserButtonProps {
	isMenuOpen: boolean;
	isMinimized?: boolean;
	setIsMenuOpen?: () => void;
}

export const UserButton = observer(
	forwardRef<HTMLButtonElement, UserButtonProps>(({ isMenuOpen, setIsMenuOpen, isMinimized }, ref) => {
		const { t: tCommon } = useTranslation('common');
		const { t: tNav } = useTranslation('nav');

		const { userStore } = useStore();

		return (
			<Button
				ref={ref}
				className={cn(
					'core-border group h-12 w-full justify-start bg-(--bg-secondary) p-2 text-left shadow-(--shadow) transition-all duration-500 ease-out group-hover:bg-(--accent-primary-hover) hover:-translate-y-px hover:border-(--accent-primary-hover) hover:shadow-(--shadow-primary)',
					isMinimized ? 'w-12' : 'xl:w-60'
				)}
				leftIcon={
					<img
						alt={userStore.username ?? tCommon(($) => $.user.default)}
						className="size-7.5 min-w-7.5 rounded-full border border-(--border-color)"
						src={userStore.avatar}
					/>
				}
				rightIcon={
					<ChevronUp
						className={cn(
							'size-6 cursor-pointer text-(--color-disabled) transition-transform duration-500 group-hover:text-(--accent-primary-text)',
							isMenuOpen && 'rotate-180',
							isMinimized ? 'opacity-0' : 'opacity-100'
						)}
					/>
				}
				size="custom"
				title={tNav(($) => $.tooltips.open)}
				variant="ghost"
				onClick={setIsMenuOpen}
			>
				<span
					className={cn(
						'w-full overflow-hidden whitespace-nowrap text-(--accent-primary-text) transition-opacity duration-500',
						isMinimized ? 'opacity-0' : 'opacity-100 delay-200'
					)}
				>
					{userStore.username ?? tCommon(($) => $.user.default)}
				</span>
			</Button>
		);
	})
);
