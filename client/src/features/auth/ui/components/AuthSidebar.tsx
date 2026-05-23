import { useTranslation } from 'react-i18next';
import { FileLock, ShieldCheck } from 'lucide-react';

import { TOOLS_LIST } from '@/entities/tool';
import { Logo } from '@/shared/ui';

export const AuthSidebar = () => {
	const { t: tAuth } = useTranslation('auth');
	const { t: tRenamer } = useTranslation('renamer');
	const { t: tShortener } = useTranslation('shortener');

	const toolOverrides = {
		renamer: { title: tRenamer(($) => $.meta.title), subtitle: tRenamer(($) => $.meta.subtitle) },
		shortener: { title: tShortener(($) => $.meta.title), subtitle: tShortener(($) => $.meta.subtitle) },
	};

	const displayFeatures = [
		...TOOLS_LIST.map((tool) => ({ ...tool, ...toolOverrides[tool.id] })),
		{
			title: tAuth(($) => $.sidebar.features.security.title),
			subtitle: tAuth(($) => $.sidebar.features.security.subtitle),
			icon: FileLock,
		},
	];

	return (
		<div className="relative z-0 h-full min-w-0 pl-4 select-none xl:w-lg">
			<div className="relative z-10 hidden h-full flex-col gap-16 rounded-l-xl border-t border-b border-l border-(--border-color) p-12 lg:flex">
				<Logo />
				<div className="flex flex-col gap-6">
					<h1 className="text-4xl font-bold whitespace-pre-line text-(--accent-primary-text)">
						{tAuth(($) => $.sidebar.title.welcome)} Tool
						<span className="text-(--color-accent)">Box</span>
					</h1>
					<h2 className="text-lg text-(--color-secondary)">{tAuth(($) => $.sidebar.title.subtitle)}</h2>
				</div>
				<div className="flex flex-1 flex-col gap-10">
					{displayFeatures.map(({ title, subtitle, icon: Icon }) => {
						return (
							<div key={title} className="flex items-center gap-4">
								<div className="aspect-square size-14 rounded-xl bg-(--accent-primary-dark) p-3">
									<Icon className="size-full text-(--color-accent)" />
								</div>
								<div className="flex flex-col gap-2">
									<h3 className="text-lg leading-4 text-(--accent-primary-text)">{title}</h3>
									<span className="leading-tight text-(--color-disabled)">{subtitle}</span>
								</div>
							</div>
						);
					})}
				</div>
				<div className="flex gap-2 text-(--color-disabled)">
					<ShieldCheck />
					<span className="">{tAuth(($) => $.sidebar.privacy)}</span>
				</div>
			</div>
			<div className="absolute top-1/3 left-0 size-100 -translate-x-1/2 rounded-full bg-[#7a5cff]/40 blur-[120px]" />
		</div>
	);
};
