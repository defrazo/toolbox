import { useTranslation } from 'react-i18next';
import { Contrast, Languages, Moon, Sun, SunMoon } from 'lucide-react';
import { observer } from 'mobx-react-lite';

import { useStore } from '@/app/providers';
import { LanguageSelect } from '@/features/language-switcher';
import type { Theme } from '@/features/theme-switcher';
import { SelectExt } from '@/shared/ui';

export const GeneralSection = observer(() => {
	const { t } = useTranslation('settings');
	const { themeStore } = useStore();

	const onChangeTheme = (theme: Theme) => {
		if (theme === themeStore.theme) return;
		themeStore.setTheme(theme);
	};

	const themes = [
		{ value: 'system', label: t(($) => $.general.theme.system), icon: Contrast },
		{ value: 'dark', label: t(($) => $.general.theme.dark), icon: Moon },
		{ value: 'light', label: t(($) => $.general.theme.light), icon: Sun },
	];

	return (
		<div className="core-border core-gap core-pad flex min-h-0 flex-1 flex-col bg-(--bg-secondary)/50 shadow-(--shadow)">
			<div className="core-gap flex flex-col">
				<div className="flex flex-col gap-2 md:flex-row md:items-center">
					<div className="flex w-full gap-2">
						<SunMoon className="hidden size-5 md:block" />
						{t(($) => $.general.theme.label)}
					</div>
					<SelectExt
						className="transition-all hover:shadow-(--shadow) md:w-36"
						options={themes}
						value={themeStore.theme}
						visibleIcon={false}
						onChange={(value) => onChangeTheme(value as Theme)}
					/>
				</div>
				<div className="flex flex-col gap-2 md:flex-row md:items-center">
					<div className="flex w-full gap-2">
						<Languages className="hidden size-5 md:block" />
						{t(($) => $.general.language.label)}
					</div>
					<LanguageSelect className="transition-all hover:shadow-(--shadow) md:w-36" />
				</div>
			</div>
		</div>
	);
});
