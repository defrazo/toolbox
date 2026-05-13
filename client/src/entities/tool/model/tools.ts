import { FolderPen, Link } from 'lucide-react';

import type { Tool } from '.';

export const TOOLS: Tool[] = [
	{ id: 'renamer', icon: FolderPen, layout: 'tool' },
	{ id: 'shortener', icon: Link, layout: 'tool' },
];
