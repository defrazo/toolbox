import { AccountSection, FaqSection, IntroSection, ToolsSection } from './components/help';

export const TabHelp = () => {
	return (
		<div className="hide-scrollbar flex h-full min-h-0 flex-col gap-8 overflow-auto">
			<IntroSection />
			<ToolsSection />
			<AccountSection />
			<FaqSection />
		</div>
	);
};
