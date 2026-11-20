import { Columns2, FolderPen, Image, Link } from 'lucide-react';

import type { Tool, ToolId } from '.';

export const TOOLS: Record<ToolId, Tool> = {
	images: { id: 'images', icon: Image, layout: 'fullscreen' },
	shortener: { id: 'shortener', icon: Link, layout: 'workspace' },
	compare: { id: 'compare', icon: Columns2, layout: 'fullscreen' },
	renamer: { id: 'renamer', icon: FolderPen, layout: 'screen' },
};

export const TOOLS_LIST = Object.values(TOOLS);
