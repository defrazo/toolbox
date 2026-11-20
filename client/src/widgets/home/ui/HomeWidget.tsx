import { useTranslation } from 'react-i18next';

import type { HomeWidgetProps } from '../model/types';
import { PromoCard, ShortcutsSection, ToolsSection } from './components';

export const HomeWidget = ({ username, tools, actions, onNavigate, onNotice }: HomeWidgetProps) => {
	const { t: tCommon } = useTranslation('common');
	const { t: tHome } = useTranslation('home');

	return (
		<>
			<div className="core-gap flex flex-col select-none">
				<h1 className="text-xl font-semibold xl:text-xl 2xl:text-4xl">
					{tHome(($) => $.greeting.title)}, {username ?? tCommon(($) => $.user.default)}!
				</h1>
				<span className="text-lg text-(--color-secondary) 2xl:text-2xl">
					{tHome(($) => $.greeting.subtitle)}
				</span>
			</div>
			<ToolsSection tools={tools} onNavigate={onNavigate} />
			<ShortcutsSection actions={actions} onNotice={onNotice} />
			<PromoCard />
		</>
	);
};
