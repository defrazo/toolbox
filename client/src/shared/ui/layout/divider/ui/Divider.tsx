import { cn } from '@/shared/lib/utils';

interface DividerProps {
	direction?: 'X' | 'Y';
	variant?: 'default' | 'custom';
	className?: string;
}

export const Divider = ({ direction = 'X', variant = 'default', className }: DividerProps) => {
	const base = direction === 'X' ? 'h-px w-full' : 'w-px h-full';

	const variants = {
		default: 'bg-(--border-color)',
		custom: '',
	};

	return <div className={cn(base, variants[variant], className)} />;
};
