import type { LucideIcon } from 'lucide-react';

export type ToolId = 'renamer' | 'shortener' | 'images' | 'compare';

export type Layout = 'workspace' | 'screen' | 'fullscreen' | 'page';

export type Tool = {
	id: ToolId;
	icon: LucideIcon;
	layout: Layout;
	isDisabled?: boolean;
};
