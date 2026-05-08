import { cn } from '@/shared/lib/utils';

import type { Component } from '../model';

export const variants: Record<Component, Record<string, string>> = {
	button: {
		default: cn(
			'rounded-xl',
			'bg-(--bg-tertiary)',
			'hover:bg-(--accent-primary-hover) hover:text-(--accent-primary-text)'
		),
		ghost: cn(
			'rounded-xl border',
			'border-(--border-color) bg-transparent',
			'hover:border-(--accent-primary-hover) hover:bg-(--accent-primary-hover) hover:text-(--accent-primary-text)'
		),
		outline: cn(
			'rounded-xl border',
			'border-transparent bg-(--bg-secondary)',
			'hover:border-(--accent-primary-hover) hover:text-(--color-accent)'
		),
		accent: cn(
			'rounded-xl',
			'bg-(--accent-primary) text-(--accent-secondary-text)',
			'hover:bg-(--accent-primary-hover)'
		),
		rounded: cn(
			'aspect-square w-fit rounded-full p-2',
			'bg-(--bg-tertiary)',
			'hover:bg-(--accent-primary-hover) hover:text-(--accent-primary-text)'
		),
		warning: cn(
			'rounded-xl border',
			'border-(--border-color) bg-(--bg-tertiary) text-(--color-disabled)',
			'hover:border-(--status-error) hover:bg-(--status-error) hover:text-(--accent-text)'
		),
		mobile: 'bg-transparent text-(--color-primary) hover:text-(--color-accent)',
		custom: '',
	},
	input: {
		default: cn('border', 'bg-(--bg-tertiary) border-transparent', 'hover:border-(--accent-primary-hover)'),
		ghost: cn('border', 'border-(--border-color) bg-transparent', 'hover:border-(--accent-primary-hover)'),
		custom: '',
	},
	textarea: {
		default: cn('border', 'bg-(--bg-tertiary) border-transparent', 'hover:border-(--accent-primary-hover)'),
		ghost: cn('border', 'border-(--border-color) bg-transparent', 'hover:border-(--accent-primary-hover)'),
		custom: '',
	},
	checkbox: { default: '' },
	checkboxBool: { default: '' },
	radio: { default: 'border-(--border-color)', custom: '' },
	select: {
		default: 'bg-(--bg-tertiary)',
		ghost: cn('border', 'border-(--border-color) bg-transparent', 'hover:border-(--accent-primary-hover) '),
		custom: '',
	},
	selectExt: {
		default: 'bg-(--bg-tertiary)',
		embedded: cn('border', 'border-(--border-color) bg-transparent', 'hover:border-(--accent-primary-hover)'),
		detached: '',
		custom: '',
	},
};
