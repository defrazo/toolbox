import { cn } from '@/shared/lib/utils';

import type { Component } from '../model';

export const variants: Record<Component, Record<string, string>> = {
	button: {
		default: cn(
			'rounded-xl ring-inset',
			'bg-(--bg-tertiary) ring-(--accent-primary-hover)',
			'hover:bg-(--accent-primary-hover) hover:text-(--accent-primary-text) focus-visible:ring-1'
		),
		ghost: cn(
			'rounded-xl border border-solid',
			'border-(--border-color) bg-transparent',
			'hover:border-(--accent-primary-hover) hover:bg-(--accent-primary-hover) hover:text-(--accent-primary-text) focus-visible:border-(--accent-primary-hover)'
		),
		outline: cn(
			'rounded-xl border border-solid',
			'border-transparent bg-(--bg-secondary)',
			'hover:border-(--accent-primary-hover) hover:text-(--color-accent) focus-visible:border-(--accent-primary-hover)'
		),
		accent: cn(
			'rounded-xl ring-inset',
			'bg-(--accent-primary) text-(--accent-secondary-text) ring-(--accent-primary-hover)',
			'hover:bg-(--accent-primary-hover) focus-visible:ring-1'
		),
		rounded: cn(
			'aspect-square w-fit rounded-full p-2 ring-inset',
			'bg-(--bg-tertiary) ring-(--accent-primary-hover)',
			'hover:bg-(--accent-primary-hover) hover:text-(--accent-primary-text) focus-visible:ring-1'
		),
		warning: cn(
			'rounded-xl border border-solid',
			'border-(--border-color) bg-(--bg-tertiary) text-(--color-disabled)',
			'hover:border-(--status-error) hover:bg-(--status-error) hover:text-(--accent-text)'
		),
		mobile: 'bg-transparent text-(--color-primary) hover:text-(--color-accent)',
		custom: '',
	},
	input: {
		default: cn(
			'ring-inset',
			'bg-(--bg-tertiary) ring-(--accent-primary-hover)',
			'focus:ring-1 hover:enabled:ring-1'
		),
		ghost: cn(
			'border border-solid',
			'border-(--border-color) bg-transparent',
			'hover:border-(--accent-primary-hover) focus:border-(--accent-primary-hover)'
		),
		custom: '',
	},
	textarea: {
		default: cn('ring-inset', 'bg-(--bg-tertiary) ring-(--accent-primary-hover)', 'hover:ring-1 focus:ring-1'),
		ghost: cn(
			'border border-solid',
			'border-(--border-color) bg-transparent',
			'hover:border-(--accent-primary-hover) focus:border-(--accent-primary-hover)'
		),
		custom: '',
	},
	checkbox: { default: '' },
	checkboxBool: { default: '' },
	radio: { default: 'border-(--border-color)', custom: '' },
	select: {
		default: cn('ring-inset', 'bg-(--bg-tertiary) ring-(--accent-primary-hover)', 'hover:ring-1 focus:ring-1'),
		ghost: cn(
			'border border-solid',
			'border-(--border-color) bg-transparent',
			'hover:border-(--accent-primary-hover) focus:border-(--accent-primary-hover)'
		),
		custom: '',
	},
	selectExt: {
		default: cn('ring-inset', 'bg-(--bg-tertiary) ring-(--accent-primary-hover)', 'hover:ring-1 focus:ring-1'),
		embedded: cn(
			'border border-solid',
			'border-(--border-color) bg-transparent',
			'hover:border-(--accent-primary-hover) focus:border-(--accent-primary-hover)'
		),
		detached: '',
		custom: '',
	},
};
