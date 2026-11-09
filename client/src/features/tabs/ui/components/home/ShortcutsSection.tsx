import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronRight, ClipboardPaste, Crop, Eraser, Upload } from 'lucide-react';

import { useStore } from '@/app/providers';
import { Carousel } from '@/shared/ui';

export const ShortcutsSection = () => {
	const { t: tHome } = useTranslation('home');

	const { notifyStore, tabsStore } = useStore();

	const clipboardRequest = useRef(0);
	useEffect(
		() => () => {
			clipboardRequest.current++;
		},
		[]
	);

	const pasteAction = async () => {
		const request = ++clipboardRequest.current;
		try {
			const text = await navigator.clipboard.readText();

			if (request !== clipboardRequest.current) return;

			if (!text.trim()) {
				tabsStore.setTab('shortener');
				notifyStore.setNotice(
					tHome(($) => $.errors.empty),
					'info'
				);
				return;
			}
			tabsStore.openShortcut({ type: 'paste-url', text });
		} catch {
			if (request !== clipboardRequest.current) return;

			tabsStore.setTab('shortener');
			notifyStore.setNotice(
				tHome(($) => $.errors.paste),
				'error'
			);
		}
	};

	const shortcuts = [
		{
			id: 'paste',
			title: tHome(($) => $.shortcuts.paste.title),
			subtitle: tHome(($) => $.shortcuts.paste.subtitle),
			icon: ClipboardPaste,
			action: pasteAction,
		},
		{
			id: 'upload',
			title: tHome(($) => $.shortcuts.upload.title),
			subtitle: tHome(($) => $.shortcuts.upload.subtitle),
			icon: Upload,
			action: () => tabsStore.openShortcut({ type: 'upload-files' }),
		},
		{
			id: 'background',
			title: tHome(($) => $.shortcuts.background.title),
			subtitle: tHome(($) => $.shortcuts.background.subtitle),
			icon: Eraser,
			action: () => tabsStore.openShortcut({ type: 'background' }),
		},
		{
			id: 'crop',
			title: tHome(($) => $.shortcuts.crop.title),
			subtitle: tHome(($) => $.shortcuts.crop.subtitle),
			icon: Crop,
			action: () => tabsStore.openShortcut({ type: 'crop' }),
		},
	];

	return (
		<Carousel title={tHome(($) => $.shortcuts.title)}>
			{shortcuts.map(({ id, title, subtitle, icon: Icon, action }) => (
				<button
					key={id}
					className="core-border group flex min-h-16 w-full min-w-0 cursor-pointer items-center gap-3 bg-(--bg-secondary)/70 p-3 text-left shadow-(--shadow) focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-(--accent-primary-hover) 2xl:min-h-18.5"
					type="button"
					onClick={action}
				>
					<div className="size-10 shrink-0 rounded-xl bg-(--accent-primary-dark) p-2">
						<Icon className="size-full text-(--color-accent)" />
					</div>
					<div className="flex min-w-0 flex-1 flex-col">
						<span className="text-base font-semibold transition-colors group-hover:text-(--accent-primary-hover) xl:text-lg">
							{title}
						</span>
						<span className="text-xs text-(--color-secondary)">{subtitle}</span>
					</div>
					<ChevronRight className="size-5 shrink-0 text-(--color-secondary) group-hover:text-(--accent-primary-hover)" />
				</button>
			))}
		</Carousel>
	);
};
