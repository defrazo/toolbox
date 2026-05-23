import { FolderPen, Link } from 'lucide-react';

import type { Tool, ToolId } from '.';

export const TOOLS: Record<ToolId, Tool> = {
	renamer: {
		id: 'renamer',
		icon: FolderPen,
		layout: 'screen',
	},
	shortener: {
		id: 'shortener',
		icon: Link,
		layout: 'workspace',
	},
};

export const TOOLS_LIST = Object.values(TOOLS);
