import { observer } from 'mobx-react-lite';

import { useStore } from '@/app/providers';
import MainPage from '@/pages/main';

import type { ToolboxTabId } from '../../toolbox/config';
import { useToolboxScreens } from '../../toolbox/registry';
import { ToolboxMobileSidebar } from '../widgets/sidebar';

export const MainScreen = observer(() => {
	const { tabsStore } = useStore();
	const screens = useToolboxScreens();

	return (
		<MainPage
			mobileSidebar={<ToolboxMobileSidebar />}
			screen={screens[tabsStore.tab as ToolboxTabId]}
			stores={{ tabsStore }}
		/>
	);
});
