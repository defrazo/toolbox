import { useTranslation } from 'react-i18next';
import { ChevronRight, type LucideIcon, PencilRuler } from 'lucide-react';

import { useStore } from '@/app/providers';
import { type ToolId, TOOLS_LIST } from '@/entities/tool';
import { cn } from '@/shared/lib/utils';
import { Button, Carousel } from '@/shared/ui';

type HomeToolId = ToolId | 'new';

type DisplayTool = {
	id: HomeToolId;
	title: string;
	subtitle: string;
	icon: LucideIcon;
	isDisabled?: boolean;
};

export const ToolsSection = () => {
	const { t: tCompare } = useTranslation('compare');
	const { t: tImages } = useTranslation('images');
	const { t: tHome } = useTranslation('home');
	const { t: tRenamer } = useTranslation('renamer');
	const { t: tShortener } = useTranslation('shortener');

	const { tabsStore } = useStore();

	const toolOverrides = {
		compare: { title: tCompare(($) => $.meta.title), subtitle: tCompare(($) => $.meta.subtitle) },
		images: { title: tImages(($) => $.meta.title), subtitle: tImages(($) => $.meta.subtitle) },
		renamer: { title: tRenamer(($) => $.meta.title), subtitle: tRenamer(($) => $.meta.subtitle) },
		shortener: { title: tShortener(($) => $.meta.title), subtitle: tShortener(($) => $.meta.subtitle) },
	};

	const displayTools: DisplayTool[] = [
		...(['images', 'shortener', 'compare', 'renamer'] as const).map((id) => ({
			...TOOLS_LIST.find((tool) => tool.id === id)!,
			...toolOverrides[id],
		})),
		{
			id: 'new',
			title: tHome(($) => $.tools.placeholder.title),
			subtitle: tHome(($) => $.tools.placeholder.subtitle),
			icon: PencilRuler,
			isDisabled: true,
		},
	];

	return (
		<Carousel title={tHome(($) => $.tools.title)}>
			{displayTools.map(({ id, title, subtitle, icon: Icon, isDisabled }) => (
				<div
					key={id}
					className={cn(
						'core-border flex min-h-40 w-full min-w-0 flex-col gap-3 bg-(--bg-secondary)/70 p-4 shadow-(--shadow) 2xl:min-h-60',
						isDisabled && 'opacity-60 grayscale'
					)}
				>
					<div className="size-12 shrink-0 rounded-xl bg-(--accent-primary-dark) p-2.5">
						<Icon className="size-full text-(--color-accent)" />
					</div>
					<div className="flex min-w-0 flex-1 flex-col gap-1">
						<h3 className="text-lg font-semibold xl:text-xl">{title}</h3>
						<span className="text-sm text-(--color-secondary)">{subtitle}</span>
					</div>
					<Button
						className="relative mt-auto text-sm hover:shadow-(--shadow)"
						disabled={isDisabled}
						rightIcon={<ChevronRight className="absolute top-1/2 right-4 size-5 -translate-y-1/2" />}
						onClick={() => {
							if (isDisabled || id === 'new') return;
							tabsStore.setTab(id);
						}}
					>
						{isDisabled ? tHome(($) => $.tools.actions.soon) : tHome(($) => $.tools.actions.open)}
					</Button>
				</div>
			))}
		</Carousel>
	);
};
