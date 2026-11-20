import { useTranslation } from 'react-i18next';
import { Home, Link, Settings } from 'lucide-react';

import { TOOLS } from '@/entities/tool';
import type { TabScreenDefinition } from '@/widgets/tabs';

import type { ToolboxTabId } from './config';

type ScreenMetadata = Pick<TabScreenDefinition, 'title' | 'subtitle' | 'icon' | 'layout'>;

export const useToolboxMetadata = (): Record<ToolboxTabId, ScreenMetadata> => {
	const { t: tHome } = useTranslation('home');
	const { t: tImages } = useTranslation('images');
	const { t: tShortener } = useTranslation('shortener');
	const { t: tCompare } = useTranslation('compare');
	const { t: tSettings } = useTranslation('settings');
	const { t: tRenamer } = useTranslation('renamer');
	const { t: tLinks } = useTranslation('links');

	return {
		home: {
			title: tHome(($) => $.meta.title),
			subtitle: tHome(($) => $.meta.subtitle),
			icon: Home,
			layout: 'page',
		},
		links: {
			title: tLinks(($) => $.meta.title),
			subtitle: tLinks(($) => $.meta.subtitle),
			icon: Link,
			layout: 'fullscreen',
		},
		settings: {
			title: tSettings(($) => $.meta.title),
			subtitle: tSettings(($) => $.meta.subtitle),
			icon: Settings,
			layout: 'workspace',
		},
		images: {
			title: tImages(($) => $.meta.title),
			subtitle: tImages(($) => $.meta.subtitle),
			icon: TOOLS.images.icon,
			layout: TOOLS.images.layout,
		},
		shortener: {
			title: tShortener(($) => $.meta.title),
			subtitle: tShortener(($) => $.meta.subtitle),
			icon: TOOLS.shortener.icon,
			layout: TOOLS.shortener.layout,
		},
		compare: {
			title: tCompare(($) => $.meta.title),
			subtitle: tCompare(($) => $.meta.subtitle),
			icon: TOOLS.compare.icon,
			layout: TOOLS.compare.layout,
		},
		renamer: {
			title: tRenamer(($) => $.meta.title),
			subtitle: tRenamer(($) => $.meta.subtitle),
			icon: TOOLS.renamer.icon,
			layout: TOOLS.renamer.layout,
		},
	};
};
