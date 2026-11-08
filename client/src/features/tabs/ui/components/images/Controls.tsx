import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, Info } from 'lucide-react';

import { Button } from '@/shared/ui';

import type { Mode } from '../../../model';
import { Footer } from './Footer';

interface ControlsProps {
	mode: Exclude<Mode, 'crop'>;
	busy: boolean;
	canProcess: boolean;
	count: number;
	readyCount: number;
	settings: ReactNode;
	info: ReactNode;
	onClear: () => void;
	onProcess: () => void;
	onDownloadZip: () => void | Promise<void>;
}

export const Controls = ({
	mode,
	busy,
	canProcess,
	count,
	readyCount,
	settings,
	info,
	onClear,
	onProcess,
	onDownloadZip,
}: ControlsProps) => {
	const { t } = useTranslation('images');

	return (
		<div className="core-border flex min-h-0 min-w-0 flex-1 flex-col bg-(--bg-secondary)/70 p-3 shadow-(--shadow)">
			<div className="flex min-w-0 flex-col gap-3 select-none">{settings}</div>
			<details className="group/hint mt-2 text-xs text-(--color-secondary)">
				<summary className="group flex cursor-pointer list-none items-center gap-1.5 rounded py-1 transition-colors select-none focus-visible:outline focus-visible:outline-(--accent-primary-hover) [&::-webkit-details-marker]:hidden">
					<Info className="size-3.5 shrink-0 group-hover:text-(--color-accent)" />
					<span className="mb-0.5 group-hover:text-(--color-accent)">{t(($) => $.info)}</span>
					<ChevronDown className="ml-auto size-3.5 shrink-0 transition-transform group-open/hint:rotate-180 group-hover:text-(--color-accent)" />
				</summary>
				<div className="mt-1 space-y-2 border-t border-(--border-color) pt-2 leading-relaxed">
					<p>{t(($) => $.limits)}</p>
					{info}
				</div>
			</details>
			<div className="mt-auto flex flex-col gap-3 pt-3">
				<Button className="active-btn w-full min-w-0" disabled={busy || !canProcess} onClick={onProcess}>
					{busy ? t(($) => $.busy) : t(($) => $[mode].process)}
				</Button>
				<Footer
					busy={busy}
					count={count}
					isVectorize={mode === 'vectorize'}
					readyCount={readyCount}
					onClear={onClear}
					onDownload={onDownloadZip}
				/>
			</div>
		</div>
	);
};
