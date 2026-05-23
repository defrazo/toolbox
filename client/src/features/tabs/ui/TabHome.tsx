import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';

import { useStore } from '@/app/providers';

import { PromoCard, ShortcutsSection, ToolsSection } from './components/home';

export const TabHome = observer(() => {
	const { t: tCommon } = useTranslation('common');
	const { t: tHome } = useTranslation('home');

	const { userStore } = useStore();

	return (
		<>
			<div className="core-gap flex flex-col select-none">
				<h1 className="text-xl font-semibold xl:text-4xl">
					{tHome(($) => $.greeting.title)}, {userStore.username ?? tCommon(($) => $.user.default)}!
				</h1>
				<span className="text-lg text-(--color-secondary) xl:text-2xl">
					{tHome(($) => $.greeting.subtitle)}
				</span>
			</div>
			<ToolsSection />
			<ShortcutsSection />
			<PromoCard />
		</>
	);
});
