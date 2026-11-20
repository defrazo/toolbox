import { useStore } from '@/app/providers';
import { TOOLS_LIST } from '@/entities/tool';
import { Home } from '@/widgets/home';

import { useToolboxMetadata } from '../../toolbox/metadata';
import { createToolboxActions } from '../../toolbox/navigation';

export const HomeScreen = () => {
	const { notifyStore, tabsStore, userStore } = useStore();

	const metadata = useToolboxMetadata();

	return (
		<Home
			actions={createToolboxActions(tabsStore)}
			stores={{ notifyStore, tabsStore, userStore }}
			tools={TOOLS_LIST.map((tool) => ({ ...tool, ...metadata[tool.id] }))}
		/>
	);
};
