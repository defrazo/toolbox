import { X } from 'lucide-react';

import { cn } from '@/shared/lib/utils';

interface ClearInputButtonProps {
	onClick: () => void;
	hidden?: boolean;
	className?: string;
}

export const ClearInputButton = ({ onClick, hidden, className }: ClearInputButtonProps) => {
	return (
		<X
			className={cn(
				'size-8 cursor-pointer p-2 opacity-50 transition-transform hover:scale-125 hover:text-(--accent-secondary-hover) hover:opacity-100',
				hidden && 'hidden',
				className
			)}
			onClick={onClick}
		/>
	);
};
