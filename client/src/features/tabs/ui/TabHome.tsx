import { useTranslation } from 'react-i18next';
import { Blocks, ChevronRight, ClipboardPaste, LifeBuoy, PencilRuler, Upload } from 'lucide-react';

import { useStore } from '@/app/providers';
import { type ToolId, TOOLS } from '@/entities/tool';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui';

export const TabHome = () => {
	const { t: tCommon } = useTranslation('common');
	const { t: tHome } = useTranslation('home');
	const { t: tRenamer } = useTranslation('renamer');
	const { t: tShortener } = useTranslation('shortener');

	const { userStore, tabsStore } = useStore();

	const toolOverrides = {
		renamer: { title: tRenamer(($) => $.meta.title), subtitle: tRenamer(($) => $.meta.subtitle) },
		shortener: { title: tShortener(($) => $.meta.title), subtitle: tShortener(($) => $.meta.subtitle) },
	};

	const displayTools = [
		...TOOLS.map((tool) => ({ ...tool, ...toolOverrides[tool.id] })),
		{
			id: 'new' as ToolId,
			title: tHome(($) => $.tools.placeholder.title),
			subtitle: tHome(($) => $.tools.placeholder.subtitle),
			icon: PencilRuler,
			isDisabled: true,
		},
	];

	const shortcuts = [
		{
			title: tHome(($) => $.shortcuts.upload.title),
			subtitle: tHome(($) => $.shortcuts.upload.subtitle),
			icon: Upload,
			action: () => {
				tabsStore.setTab('renamer');
				setTimeout(() => document.getElementById('renamer-upload')?.click(), 0);
			},
		},
		{
			title: tHome(($) => $.shortcuts.paste.title),
			subtitle: tHome(($) => $.shortcuts.paste.subtitle),
			icon: ClipboardPaste,
			action: async () => {
				tabsStore.setTab('shortener');
				const text = await navigator.clipboard.readText();
				setTimeout(() => window.dispatchEvent(new CustomEvent('shortcut:paste-url', { detail: text })), 50);
			},
		},
		{
			title: tHome(($) => $.shortcuts.help.title),
			subtitle: tHome(($) => $.shortcuts.help.subtitle),
			icon: LifeBuoy,
			action: () => tabsStore.setTab('help'),
		},
	];

	return (
		<>
			<div className="flex flex-col gap-3 select-none">
				<h1 className="text-4xl font-semibold">
					{tHome(($) => $.greeting.title)}, {userStore.username ?? tCommon(($) => $.user.default)}!
				</h1>
				<span className="text-2xl text-(--color-secondary)">{tHome(($) => $.greeting.subtitle)}</span>
			</div>
			<div className="flex flex-col gap-4 select-none">
				<h2 className="text-2xl font-semibold">{tHome(($) => $.tools.title)}</h2>
				<div className="flex gap-6">
					{displayTools.map(({ id, title, subtitle, icon: Icon, isDisabled }) => {
						return (
							<div
								key={id}
								className={cn(
									'core-border flex flex-1 flex-col gap-4 bg-(--bg-secondary)/70 p-6 transition-transform duration-300 ease-in-out hover:scale-105',
									isDisabled && 'grayscale'
								)}
							>
								<div className="aspect-square size-20 rounded-xl bg-(--accent-primary-dark) p-3">
									<Icon className="size-full text-(--color-accent)" />
								</div>
								<div className="flex flex-col">
									<h3 className="text-xl font-semibold">{title}</h3>
									<span className="text-(--color-secondary)">{subtitle}</span>
								</div>
								<Button
									className={cn('relative', isDisabled && 'pointer-events-none')}
									rightIcon={<ChevronRight className="absolute top-1/2 right-4 -translate-y-1/2" />}
									onClick={() => tabsStore.setTab(id)}
								>
									{isDisabled
										? tHome(($) => $.tools.actions.soon)
										: tHome(($) => $.tools.actions.open)}
								</Button>
							</div>
						);
					})}
				</div>
			</div>
			<div className="flex flex-col gap-4 select-none">
				<h2 className="text-2xl font-semibold">{tHome(($) => $.shortcuts.title)}</h2>
				<div className="flex gap-6">
					{shortcuts.map(({ title, subtitle, icon: Icon, action }) => {
						return (
							<div
								key={title}
								className="core-border group flex flex-1 cursor-pointer items-center gap-4 bg-(--bg-secondary)/70 px-6 py-4 transition-transform duration-300 ease-in-out hover:scale-105"
								onClick={action}
							>
								<div className="aspect-square size-14 rounded-xl bg-(--accent-primary-dark) p-3">
									<Icon className="size-full text-(--color-accent)" />
								</div>
								<div className="flex flex-col">
									<span className="text-lg group-hover:text-(--accent-primary-hover)">{title}</span>
									<span className="text-(--color-secondary)">{subtitle}</span>
								</div>
								<ChevronRight className="ml-auto size-7 text-(--color-secondary) group-hover:text-(--accent-primary-hover)" />
							</div>
						);
					})}
				</div>
			</div>
			<div className="flex h-fit flex-col items-start rounded-2xl bg-(--accent-primary)/10 p-6 select-none">
				<div className="flex items-center gap-4">
					<Blocks className="size-10 text-(--color-accent)" />
					<div className="flex flex-col gap-2">
						<span className="leading-4 text-(--color-accent)">{tHome(($) => $.promo.title)}</span>
						<span className="leading-4 text-(--color-secondary)">{tHome(($) => $.promo.subtitle)}</span>
					</div>
				</div>
			</div>
		</>
	);
};
