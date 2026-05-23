import { useTranslation } from 'react-i18next';
import { ChevronRight, ClipboardPaste, LifeBuoy, Upload } from 'lucide-react';

import { useStore } from '@/app/providers';

export const ShortcutsSection = () => {
	const { t: tHome } = useTranslation('home');

	const { tabsStore, notifyStore } = useStore();

	const uploadAction = () => {
		tabsStore.setTab('renamer');
		setTimeout(() => document.getElementById('renamer-upload')?.click(), 0);
	};

	const pasteAction = async () => {
		tabsStore.setTab('shortener');

		try {
			const text = await navigator.clipboard.readText();
			if (!text.trim()) {
				notifyStore.setNotice(
					tHome(($) => $.errors.empty),
					'info'
				);
				return;
			}
			setTimeout(() => window.dispatchEvent(new CustomEvent('shortcut:paste-url', { detail: text })), 50);
		} catch {
			notifyStore.setNotice(
				tHome(($) => $.errors.paste),
				'error'
			);
		}
	};

	const shortcuts = [
		{
			id: 'upload',
			title: tHome(($) => $.shortcuts.upload.title),
			subtitle: tHome(($) => $.shortcuts.upload.subtitle),
			icon: Upload,
			action: uploadAction,
		},
		{
			id: 'paste',
			title: tHome(($) => $.shortcuts.paste.title),
			subtitle: tHome(($) => $.shortcuts.paste.subtitle),
			icon: ClipboardPaste,
			action: pasteAction,
		},
		{
			id: 'help',
			title: tHome(($) => $.shortcuts.help.title),
			subtitle: tHome(($) => $.shortcuts.help.subtitle),
			icon: LifeBuoy,
			action: () => tabsStore.setTab('help'),
		},
	];

	return (
		<div className="flex flex-col gap-3 select-none xl:gap-4">
			<h2 className="text-lg font-semibold xl:text-2xl">{tHome(($) => $.shortcuts.title)}</h2>
			<div className="flex flex-col gap-3 xl:flex-row xl:gap-6">
				{shortcuts.map(({ id, title, subtitle, icon: Icon, action }) => (
					<button
						key={id}
						className="core-border group relative flex flex-1 cursor-pointer items-center gap-2 bg-(--bg-secondary)/70 px-2 py-2 text-left shadow-(--shadow) transition-transform duration-300 ease-in-out hover:scale-105 xl:px-4 xl:py-3"
						type="button"
						onClick={action}
					>
						<div className="aspect-square size-10 rounded-xl bg-(--accent-primary-dark) p-2">
							<Icon className="size-full text-(--color-accent)" />
						</div>
						<div className="flex flex-col">
							<span className="text-base font-semibold transition-colors group-hover:text-(--accent-primary-hover) xl:text-lg">
								{title}
							</span>
							<span className="text-xs text-(--color-secondary) xl:text-sm">{subtitle}</span>
						</div>
						<ChevronRight className="absolute top-1/2 right-2 size-5 -translate-y-1/2 text-(--color-secondary) group-hover:text-(--accent-primary-hover) xl:size-7" />
					</button>
				))}
			</div>
		</div>
	);
};
