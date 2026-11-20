import type { ReactNode } from 'react';
import { observer } from 'mobx-react-lite';

import type { TabsStore } from '@/features/tabs';
import { useDeviceType } from '@/shared/lib/hooks';
import TabContainer, { type TabScreenDefinition } from '@/widgets/tabs';

interface MainPageProps {
	stores: { tabsStore: TabsStore };
	screen: TabScreenDefinition;
	mobileSidebar: ReactNode;
}

const MainPage = observer(({ stores, screen, mobileSidebar }: MainPageProps) => {
	const device = useDeviceType();

	const { tabsStore } = stores;

	return (
		<div className="relative flex min-h-0 flex-1 flex-col gap-4">
			{device === 'mobile' && mobileSidebar}
			<TabContainer activeTab={tabsStore.tab} screen={screen} />
		</div>
	);
});

export default MainPage;
