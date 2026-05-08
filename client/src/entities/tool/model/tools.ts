import { FolderPen, Link, type LucideIcon } from 'lucide-react';

export type ToolId = 'renamer' | 'shortener';

export type Layout = 'workspace' | 'tool' | 'page';

export type Tool = {
	id: ToolId;
	title: string;
	shortTitle?: string;
	subtitle: string;
	icon: LucideIcon;
	path?: string;
	layout?: Layout;
	isDisabled?: boolean;
};

export const TOOLS: Tool[] = [
	{
		id: 'renamer',
		title: 'Переименовать файлы',
		shortTitle: 'Переименование файлов',
		subtitle: 'Массовое переименование файлов в пару кликов',
		icon: FolderPen,
		path: '/renamer',
		layout: 'tool',
	},
	{
		id: 'shortener',
		title: 'Сократить ссылку',
		shortTitle: 'Сокращение ссылок',
		subtitle: 'Быстро создавайте короткие ссылки для ваших задач',
		icon: Link,
		path: '/shortener',
		layout: 'tool',
	},
];
