import { useTranslation } from 'react-i18next';
import { LayoutDashboard, Route } from 'lucide-react';

import { SectionTitle } from '.';

export const IntroSection = () => {
	const { t } = useTranslation('help');

	const intro = [
		{
			id: 'about',
			title: t(($) => $.intro.toolbox.title),
			desc: t(($) => $.intro.toolbox.desc),
			icon: LayoutDashboard,
		},
		{
			id: 'interface',
			title: t(($) => $.intro.interface.title),
			desc: t(($) => $.intro.interface.desc),
			icon: Route,
		},
	];

	return (
		<section className="core-gap flex flex-1 flex-col">
			<SectionTitle>{t(($) => $.sections.intro)}</SectionTitle>
			<div className="core-gap flex flex-col lg:flex-row">
				{intro.map(({ id, title, desc, icon: Icon }) => (
					<div
						key={id}
						className="core-border core-gap core-pad flex flex-1 items-center bg-(--bg-secondary)/50 shadow-(--shadow)"
					>
						<div className="hidden size-14 shrink-0 items-center justify-center rounded-xl bg-(--accent-primary-dark) p-3 xl:flex">
							<Icon className="size-full text-(--color-accent)" />
						</div>
						<div className="flex flex-col gap-2 xl:gap-0">
							<div className="flex items-center gap-2">
								<Icon className="size-5 text-(--color-accent) xl:hidden" />
								<span className="font-medium">{title}</span>
							</div>
							<span className="text-justify text-sm leading-tight text-(--color-secondary)">{desc}</span>
						</div>
					</div>
				))}
			</div>
		</section>
	);
};
