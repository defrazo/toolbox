import { ChevronUp } from 'lucide-react';
import { observer } from 'mobx-react-lite';

import { useStore } from '@/app/providers';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui';

export const UserButton = observer(({ onClick, minimized }: { onClick?: () => void; minimized?: boolean }) => {
	const { userStore } = useStore();

	return (
		<div className="group relative" onClick={onClick}>
			<Button
				className={cn(
					'h-12 w-full justify-start border-[#fafafa12] p-2 text-left transition-[width] duration-500 group-hover:bg-(--accent-primary-hover)',
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
				title="Открыть меню пользователя"
				variant="ghost"
			>
				<span
					className={cn(
						'overflow-hidden whitespace-nowrap text-(--accent-primary-text) transition-opacity duration-500',
						minimized ? 'opacity-0' : 'opacity-100 delay-200'
					)}
				>
					{userStore.username}
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
