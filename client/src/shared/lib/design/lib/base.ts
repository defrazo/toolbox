import { cn } from '@/shared/lib/utils';

import type { Component } from '../model';

export const base: Record<Component, string> = {
	button: cn(
		'flex items-center justify-center',
		'focus-visible:ring-1 focus-visible:ring-(--accent-primary-hover)',
		'cursor-pointer transition-colors duration-300 outline-none select-none'
	),
	input: cn(
		'w-full rounded-xl',
		'focus-visible:ring-1 focus-visible:ring-(--accent-primary-hover)',
		'transition-colors outline-none'
	),
	textarea: cn(
		'w-full rounded-xl',
		'focus-visible:ring-1 focus-visible:ring-(--accent-primary-hover)',
		'transition-colors outline-none'
	),
	checkbox: '',
	checkboxBool: '',
	radio: 'cursor-pointer appearance-none transition-colors outline-none',
	select: cn(
		'w-full rounded-xl',
		'focus-visible:ring-1 focus-visible:ring-(--accent-primary-hover)',
		'cursor-pointer appearance-none transition-colors outline-none'
	),
	selectExt: cn(
		'flex w-full items-center rounded-xl',
		'focus-visible:ring-1 focus-visible:ring-(--accent-primary-hover)',
		'cursor-pointer text-nowrap transition-colors outline-none'
	),
};
