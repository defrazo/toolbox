import { useTranslation } from 'react-i18next';
import { ChevronRight, type LucideIcon, PencilRuler } from 'lucide-react';

import { useStore } from '@/app/providers';
import { type ToolId, TOOLS_LIST } from '@/entities/tool';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui';

type HomeToolId = ToolId | 'new';

type DisplayTool = {
	id: HomeToolId;
	title: string;
	subtitle: string;
	icon: LucideIcon;
	isDisabled?: boolean;
};

export const ToolsSection = () => {
	const { t: tHome } = useTranslation('home');
	const { t: tRenamer } = useTranslation('renamer');
	const { t: tShortener } = useTranslation('shortener');

	const { tabsStore } = useStore();

	const toolOverrides = {
		renamer: { title: tRenamer(($) => $.meta.title), subtitle: tRenamer(($) => $.meta.subtitle) },
		shortener: { title: tShortener(($) => $.meta.title), subtitle: tShortener(($) => $.meta.subtitle) },
	};

	const displayTools: DisplayTool[] = [
		...TOOLS_LIST.map((tool) => ({ ...tool, ...toolOverrides[tool.id] })),
		{
			id: 'new',
			title: tHome(($) => $.tools.placeholder.title),
			subtitle: tHome(($) => $.tools.placeholder.subtitle),
			icon: PencilRuler,
			isDisabled: true,
		},
	];

	return (
		<div className="flex flex-col gap-3 select-none xl:gap-4">
			<h2 className="text-lg font-semibold xl:text-2xl">{tHome(($) => $.tools.title)}</h2>
			<div className="flex flex-col gap-3 xl:flex-row xl:gap-6">
				{displayTools.map(({ id, title, subtitle, icon: Icon, isDisabled }) => (
					<div
						key={id}
						className={cn(
							'core-border core-pad flex flex-1 flex-col justify-between gap-3 bg-(--bg-secondary)/70 shadow-(--shadow) transition-transform duration-300 ease-in-out hover:scale-105 xl:gap-4',
							isDisabled && 'grayscale'
						)}
					>
						<div className="aspect-square size-14 rounded-xl bg-(--accent-primary-dark) p-3 xl:size-20">
							<Icon className="size-full text-(--color-accent)" />
						</div>
						<div className="flex flex-col">
							<h3 className="text-lg font-semibold xl:text-xl">{title}</h3>
							<span className="text-sm text-(--color-secondary) xl:text-base">{subtitle}</span>
						</div>
						<Button
							className="relative text-sm hover:shadow-(--shadow) xl:text-base"
							disabled={isDisabled}
							rightIcon={
								<ChevronRight className="absolute top-1/2 right-4 size-5 -translate-y-1/2 xl:size-7" />
							}
							onClick={() => {
								if (isDisabled || id === 'new') return;
								tabsStore.setTab(id);
							}}
						>
							{isDisabled ? tHome(($) => $.tools.actions.soon) : tHome(($) => $.tools.actions.open)}
						</Button>
					</div>
				))}
			</div>
		</div>
	);
};
