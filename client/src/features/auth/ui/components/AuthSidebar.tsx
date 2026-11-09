import { useTranslation } from 'react-i18next';

import { TOOLS_LIST } from '@/entities/tool';
import { Logo } from '@/shared/ui';

export const AuthSidebar = () => {
	const { t: tAuth } = useTranslation('auth');
	const { t: tImages } = useTranslation('images');
	const { t: tShortener } = useTranslation('shortener');
	const { t: tCompare } = useTranslation('compare');
	const { t: tRenamer } = useTranslation('renamer');

	const toolOverrides = {
		images: { title: tImages(($) => $.meta.title), subtitle: tImages(($) => $.meta.subtitle) },
		shortener: { title: tShortener(($) => $.meta.title), subtitle: tShortener(($) => $.meta.subtitle) },
		compare: { title: tCompare(($) => $.meta.title), subtitle: tCompare(($) => $.meta.subtitle) },
		renamer: { title: tRenamer(($) => $.meta.title), subtitle: tRenamer(($) => $.meta.subtitle) },
	};

	const displayFeatures = [...TOOLS_LIST.map((tool) => ({ ...tool, ...toolOverrides[tool.id] }))];

	return (
		<div className="relative z-0 h-full min-w-0 border-r border-(--border-color) select-none lg:w-md 2xl:w-xl">
			<div className="relative z-10 hidden h-full flex-col gap-4 p-6 lg:flex 2xl:gap-16 2xl:p-12">
				<Logo />
				<div className="flex flex-col gap-3 xl:gap-6">
					<h1 className="text-2xl font-bold whitespace-pre-line text-(--accent-primary-text) 2xl:text-4xl">
						{tAuth(($) => $.sidebar.title.welcome)} Tool
						<span className="text-(--color-accent)">Box</span>
					</h1>
					<h2 className="text-(--color-secondary) 2xl:text-lg">{tAuth(($) => $.sidebar.title.subtitle)}</h2>
				</div>
				<div className="flex flex-1 flex-col gap-7 xl:gap-10">
					{displayFeatures.map(({ title, subtitle, icon: Icon }) => {
						return (
							<div key={title} className="flex items-center gap-3 xl:gap-4">
								<div className="aspect-square size-10 rounded-xl bg-(--accent-primary-dark) p-2 xl:size-11 2xl:size-14 2xl:p-3">
									<Icon className="size-full text-(--color-accent)" />
								</div>
								<div className="flex flex-col gap-2">
									<h3 className="leading-4 text-(--accent-primary-text) 2xl:text-lg">{title}</h3>
									<span className="text-xs leading-tight text-(--color-disabled) xl:text-sm 2xl:text-base">
										{subtitle}
									</span>
								</div>
							</div>
						);
					})}
				</div>
			</div>
			<div className="absolute top-1/3 left-0 size-100 -translate-x-1/2 rounded-full bg-[#7a5cff]/40 blur-[120px]" />
		</div>
	);
};
