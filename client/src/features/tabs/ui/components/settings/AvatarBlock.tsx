import { type Dispatch, type SetStateAction, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';

import { useStore } from '@/app/providers';
import { AVATARS } from '@/shared/assets/images/avatars';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui';

interface AvatarBlockProps {
	isOpenPicker: boolean;
	setIsOpenPicker: Dispatch<SetStateAction<boolean>>;
}

export const AvatarBlock = observer(({ isOpenPicker, setIsOpenPicker }: AvatarBlockProps) => {
	const { t } = useTranslation('settings');
	const { userStore } = useStore();

	const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);

	const applyAvatar = () => {
		if (!selectedAvatar || selectedAvatar === userStore.avatar) return;
		userStore.updateAvatar(selectedAvatar);
		setIsOpenPicker(false);
	};

	return (
		<>
			<img
				alt={t(($) => $.account.avatar.alt)}
				className="mx-auto size-40 cursor-pointer rounded-full border-2 border-transparent ring-inset hover:border-(--accent-primary-hover)"
				src={userStore.avatar}
				onClick={() => setIsOpenPicker((prev) => !prev)}
			/>
			<div className="hidden h-full w-px bg-(--border-color) xl:block" />
			{isOpenPicker && (
				<div className="core-gap flex flex-col">
					<div className="flex flex-wrap justify-between gap-2">
						{AVATARS.map((src, idx) => (
							<img
								key={src}
								alt={t(($) => $.account.avatar.optionAlt, { number: idx + 1 })}
								className={cn(
									'aspect-square size-15 cursor-pointer rounded-full object-cover transition hover:scale-[1.2] xl:size-28',
									selectedAvatar === src && 'ring-3 ring-(--accent-primary)'
								)}
								src={src}
								onClick={() => setSelectedAvatar(src)}
							/>
						))}
					</div>
					<Button
						className="col-span-4 mx-auto mt-2 max-w-64 hover:shadow-(--shadow)"
						disabled={!selectedAvatar || userStore.avatar === selectedAvatar}
						onClick={applyAvatar}
					>
						{t(($) => $.account.avatar.apply)}
					</Button>
				</div>
			)}
		</>
	);
});
