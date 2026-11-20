import { TabFooter, type TabScreenDefinition } from '@/widgets/tabs';

import { DifferScreen } from '../composition/widgets/differ';
import { HomeScreen } from '../composition/widgets/home';
import { ImagesScreen } from '../composition/widgets/images';
import { LinksScreen } from '../composition/widgets/links';
import { RenamerScreen } from '../composition/widgets/renamer';
import { SettingsScreen } from '../composition/widgets/settings';
import { ShortenerScreen } from '../composition/widgets/shortener';
import type { ToolboxTabId } from './config';
import { useToolboxMetadata } from './metadata';

export const useToolboxScreens = (): Record<ToolboxTabId, TabScreenDefinition> => {
	const metadata = useToolboxMetadata();

	return {
		home: { ...metadata.home, component: HomeScreen, presentation: { title: 'hidden' }, footer: <TabFooter /> },
		links: { ...metadata.links, component: LinksScreen },
		settings: { ...metadata.settings, component: SettingsScreen },
		images: {
			...metadata.images,
			component: ImagesScreen,
			presentation: { containedDesktopScroll: true, title: 'fixed' },
		},
		shortener: { ...metadata.shortener, component: ShortenerScreen },
		compare: { ...metadata.compare, component: DifferScreen },
		renamer: { ...metadata.renamer, component: RenamerScreen },
	};
};
