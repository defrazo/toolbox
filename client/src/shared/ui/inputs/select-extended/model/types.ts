import type { LucideIcon } from 'lucide-react';

export type SelectExtOption = {
	key?: string;
	value: string;
	label: string;
	icon?: string | LucideIcon;
	disabled?: boolean;
};

export type Justify = 'start' | 'center' | 'end';

export type Direction = 'auto' | 'up' | 'down';
