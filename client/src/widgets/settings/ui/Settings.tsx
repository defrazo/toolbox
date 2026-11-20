import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import type { SettingsStores } from '../model/types';
import { AvatarBlock, GeneralSection, PasswordBlock, ProfileBlock } from './components';

export const Settings = ({ stores }: { stores: SettingsStores }) => {
	const { t } = useTranslation('settings');

	const { notifyStore, themeStore, userStore } = stores;

	const [isOpenPicker, setIsOpenPicker] = useState(false);

	return (
		<>
			<div className="core-gap flex flex-col select-none">
				<h2 className="text-lg leading-4 text-(--color-secondary) opacity-70">{t(($) => $.account.title)}</h2>
				<div className="core-border core-pad flex min-h-0 flex-1 flex-col gap-4 bg-(--bg-secondary)/50 shadow-(--shadow) select-none lg:flex-row">
					<AvatarBlock
						isOpenPicker={isOpenPicker}
						setIsOpenPicker={setIsOpenPicker}
						stores={{ notifyStore, userStore }}
					/>
					{!isOpenPicker && (
						<div className="core-gap flex w-full flex-1 flex-col self-start">
							<ProfileBlock stores={{ notifyStore, userStore }} />
							<PasswordBlock stores={{ notifyStore }} />
						</div>
					)}
				</div>
			</div>
			<div className="core-gap flex flex-col select-none">
				<h2 className="text-lg leading-4 text-(--color-secondary) opacity-70">{t(($) => $.general.title)}</h2>
				<GeneralSection stores={{ themeStore }} />
			</div>
		</>
	);
};
