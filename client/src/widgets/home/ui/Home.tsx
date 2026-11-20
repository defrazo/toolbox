import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';

import type { HomeActions, HomeStores, HomeTool } from '../model/types';
import { PromoCard, ShortcutsSection, ToolsSection } from './components';

interface HomeProps {
	stores: HomeStores;
	tools: readonly HomeTool[];
	actions: HomeActions;
}

export const Home = observer(({ stores, tools, actions }: HomeProps) => {
	const { t: tCommon } = useTranslation('common');
	const { t: tHome } = useTranslation('home');

	const { notifyStore, tabsStore, userStore } = stores;

	return (
		<>
			<div className="core-gap flex flex-col select-none">
				<h1 className="text-xl font-semibold xl:text-xl 2xl:text-4xl">
					{tHome(($) => $.greeting.title)}, {userStore.username ?? tCommon(($) => $.user.default)}!
				</h1>
				<span className="text-lg text-(--color-secondary) 2xl:text-2xl">
					{tHome(($) => $.greeting.subtitle)}
				</span>
			</div>
			<ToolsSection tools={tools} onNavigate={(id) => tabsStore.setTab(id)} />
			<ShortcutsSection actions={actions} stores={{ notifyStore }} />
			<PromoCard />
		</>
	);
});
