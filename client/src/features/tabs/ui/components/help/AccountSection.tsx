import { useTranslation } from 'react-i18next';
import { Lock, Pencil, Sun, UserCircle } from 'lucide-react';

import { Divider } from '@/shared/ui';

import { SectionTitle } from '.';

export const AccountSection = () => {
	const { t } = useTranslation('help');

	const tips = [
		{
			id: 'avatar',
			title: t(($) => $.account.avatar.title),
			text: t(($) => $.account.avatar.text),
			icon: UserCircle,
		},
		{
			id: 'profile',
			title: t(($) => $.account.profile.title),
			text: t(($) => $.account.profile.text),
			icon: Pencil,
		},
		{
			id: 'password',
			title: t(($) => $.account.password.title),
			text: t(($) => $.account.password.text),
			icon: Lock,
		},
		{
			id: 'appearance',
			title: t(($) => $.account.appearance.title),
			text: t(($) => $.account.appearance.text),
			icon: Sun,
		},
	];

	return (
		<section className="core-gap flex flex-1 flex-col">
			<SectionTitle>{t(($) => $.sections.account)}</SectionTitle>
			<div className="core-gap flex flex-col lg:flex-row">
				{tips.map(({ id, title, text, icon: Icon }) => (
					<div
						key={id}
						className="core-border flex flex-1 flex-col items-center gap-2 bg-(--bg-secondary)/50 px-3 py-3 shadow-(--shadow) 2xl:px-4"
					>
						<div className="mr-auto flex items-center gap-2">
							<Icon className="mt-0.5 size-5 shrink-0 text-(--color-accent)" />
							<span>{title}</span>
						</div>
						<Divider />
						<span className="text-center text-sm leading-tight">{text}</span>
					</div>
				))}
			</div>
		</section>
	);
};
