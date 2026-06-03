import { type Dispatch, type SetStateAction, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';

import { useStore } from '@/app/providers';
import { updateProfile } from '@/entities/user';
import { AVATAR_ENTRIES, type AvatarId, AVATARS } from '@/shared/assets/images/avatars';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui';

interface AvatarBlockProps {
	isOpenPicker: boolean;
	setIsOpenPicker: Dispatch<SetStateAction<boolean>>;
}

export const AvatarBlock = observer(({ isOpenPicker, setIsOpenPicker }: AvatarBlockProps) => {
	const { t } = useTranslation('settings');

	const { notifyStore, userStore } = useStore();

	const [isLoading, setIsLoading] = useState(false);
	const [selectedAvatar, setSelectedAvatar] = useState<AvatarId | null>(null);

	const canSaveAvatar = selectedAvatar || selectedAvatar === userStore.avatarId;

	const applyAvatar = async () => {
		if (!canSaveAvatar) return;

		setIsLoading(true);

		try {
			const { data } = await updateProfile({ avatar: selectedAvatar });

			userStore.setUser(data.user);

			notifyStore.setNotice(
				t(($) => $.success.avatar),
				'success'
			);

			setIsOpenPicker(false);
		} catch {
			notifyStore.setNotice(
				t(($) => $.success.avatar),
				'error'
			);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<>
			<img
				alt={t(($) => $.account.avatar.alt)}
				className="mx-auto size-40 cursor-pointer rounded-full border-2 border-transparent ring-inset hover:border-(--accent-primary-hover)"
				src={selectedAvatar ? AVATARS[selectedAvatar] : userStore.avatar}
				onClick={() => setIsOpenPicker((prev) => !prev)}
			/>
			<div className="hidden h-full w-px bg-(--border-color) xl:block" />
			{isOpenPicker && (
				<div className="core-gap flex flex-col">
					<div className="flex flex-wrap justify-between gap-2">
						{AVATAR_ENTRIES.map(([id, src], idx) => (
							<img
								key={id}
								alt={t(($) => $.account.avatar.optionAlt, { number: idx + 1 })}
								className={cn(
									'aspect-square size-15 cursor-pointer rounded-full object-cover transition hover:scale-[1.2] xl:size-28',
									selectedAvatar === src && 'ring-3 ring-(--accent-primary)'
								)}
								src={src}
								onClick={() => setSelectedAvatar(id)}
							/>
						))}
					</div>
					<Button
						className={cn(
							'col-span-4 mx-auto mt-2 w-full hover:shadow-(--shadow) xl:w-64',
							canSaveAvatar && 'active-btn'
						)}
						disabled={isLoading || !canSaveAvatar}
						loading={isLoading}
						onClick={applyAvatar}
					>
						{t(($) => $.account.avatar.apply)}
					</Button>
				</div>
			)}
		</>
	);
});
