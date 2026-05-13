import { useTranslation } from 'react-i18next';
import { ChevronUp } from 'lucide-react';
import { observer } from 'mobx-react-lite';

import { useStore } from '@/app/providers';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui';

export const UserButton = observer(({ onClick, minimized }: { onClick?: () => void; minimized?: boolean }) => {
	const { t: tCommon } = useTranslation('common');
	const { t: tNav } = useTranslation('nav');

	const { userStore } = useStore();

	return (
		<div className="group relative" onClick={onClick}>
			<Button
				className={cn(
					'core-border h-12 w-full justify-start bg-(--bg-secondary) p-2 text-left shadow-(--shadow) transition-all duration-500 ease-out group-hover:bg-(--accent-primary-hover) hover:-translate-y-px hover:border-(--accent-primary-hover) hover:shadow-(--shadow-primary)',
					minimized ? 'w-12' : 'w-60'
				)}
				leftIcon={
					<img
						alt={userStore.avatar}
						className="size-7.5 min-w-7.5 rounded-full border border-(--border-color)"
						src={userStore.avatar}
					/>
				}
				size="custom"
				title={tNav(($) => $.tooltips.open)}
				variant="ghost"
			>
				<span
					className={cn(
						'overflow-hidden whitespace-nowrap text-(--accent-primary-text) transition-opacity duration-500',
						minimized ? 'opacity-0' : 'opacity-100 delay-200'
					)}
				>
					{userStore.username ?? tCommon(($) => $.user.default)}
				</span>
			</Button>
			<ChevronUp
				className={cn(
					'absolute right-2 bottom-3 size-6 cursor-pointer text-(--color-disabled) group-hover:text-(--accent-primary-text)',
					minimized ? 'opacity-0' : 'opacity-100'
				)}
			/>
		</div>
	);
});
