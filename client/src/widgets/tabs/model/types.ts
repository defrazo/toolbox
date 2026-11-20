import type { ComponentType, ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

import type { Layout } from '@/entities/tool';

export type TabScreenDefinition = {
	component: ComponentType;
	title: string;
	subtitle: string;
	icon: LucideIcon;
	layout: Layout;
	presentation?: {
		containedDesktopScroll?: boolean;
		title?: 'normal' | 'fixed' | 'hidden';
	};
	footer?: ReactNode;
};
