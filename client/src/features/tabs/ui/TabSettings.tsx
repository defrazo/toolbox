import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { AvatarBlock, GeneralSection, PasswordBlock, ProfileBlock } from './components/settings';

export const TabSettings = () => {
	const { t } = useTranslation('settings');

	const [isOpenPicker, setIsOpenPicker] = useState(false);

	return (
		<>
			<div className="core-gap flex flex-col select-none">
				<h2 className="text-lg leading-4 text-(--color-secondary) opacity-70">{t(($) => $.account.title)}</h2>
				<div className="core-border core-pad flex min-h-0 flex-1 flex-col gap-4 bg-(--bg-secondary)/50 shadow-(--shadow) select-none lg:flex-row">
					<AvatarBlock isOpenPicker={isOpenPicker} setIsOpenPicker={setIsOpenPicker} />
					{!isOpenPicker && (
						<div className="core-gap flex w-full flex-1 flex-col self-start">
							<ProfileBlock />
							<PasswordBlock />
						</div>
					)}
				</div>
			</div>
			<div className="core-gap flex flex-col select-none">
				<h2 className="text-lg leading-4 text-(--color-secondary) opacity-70">{t(($) => $.general.title)}</h2>
				<GeneralSection />
			</div>
		</>
	);
};
