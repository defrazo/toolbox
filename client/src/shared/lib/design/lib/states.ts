import { cn } from '@/shared/lib/utils';

export const states: Record<string, string> = {
	active: 'bg-(--accent-primary-hover) text-(--accent-primary-text)',
	disabled: cn('bg-(--bg-tertiary) text-(--color-disabled)', 'pointer-events-none opacity-30'),
	error: cn('border-(--status-error) text-(--status-error)', 'animate-pulse'),
	loading: 'cursor-wait opacity-80',
};
