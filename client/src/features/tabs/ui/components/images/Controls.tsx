import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, Info } from 'lucide-react';

import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui';

import type { Mode } from '../../../model';
import { Footer } from './Footer';

interface ControlsProps {
	mode: Exclude<Mode, 'crop'>;
	busy: boolean;
	zipProgress: number | null;
	isProcessing: boolean;
	progress: { completed: number; total: number } | null;
	preparationProgress: ControlsProps['progress'];
	activeCount: number;
	canProcess: boolean;
	count: number;
	readyCount: number;
	settings: ReactNode;
	info: ReactNode;
	onCancel: () => void;
	onClear: () => void;
	onProcess: () => void;
	onDownload: () => void | Promise<void>;
}

export const Controls = ({
	mode,
	busy,
	zipProgress,
	isProcessing,
	progress,
	preparationProgress,
	activeCount,
	canProcess,
	count,
	readyCount,
	settings,
	info,
	onCancel,
	onClear,
	onProcess,
	onDownload,
}: ControlsProps) => {
	const { t } = useTranslation('images');

	const currentProgress = isProcessing ? progress : preparationProgress;
	const title = isProcessing ? t(($) => $.processingTitle) : t(($) => $.preparationTitle);
	const description = currentProgress
		? isProcessing
			? t(($) => $.batchProgress, { count: currentProgress.completed, total: currentProgress.total })
			: t(($) => $.preparationProgress, { count: currentProgress.completed, total: currentProgress.total })
		: '';
	const percent = currentProgress?.total
		? Math.min(100, Math.max(0, Math.round((currentProgress.completed / currentProgress.total) * 100)))
		: 0;

	return (
		<div className="core-border flex min-w-0 flex-1 scrollbar-none flex-col overflow-y-auto bg-(--bg-secondary)/70 p-3 shadow-(--shadow)">
			{settings}
			<details className="group/hint mt-2 text-xs text-(--color-secondary)">
				<summary className="group flex cursor-pointer list-none items-center gap-1.5 rounded py-1 transition-colors select-none focus-visible:outline focus-visible:outline-(--accent-primary-hover) [&::-webkit-details-marker]:hidden">
					<Info className="size-3.5 shrink-0 group-hover:text-(--color-accent)" />
					<span className="mb-0.5 group-hover:text-(--color-accent)">{t(($) => $.info)}</span>
					<ChevronDown className="ml-auto size-3.5 shrink-0 transition-transform group-open/hint:rotate-180 group-hover:text-(--color-accent)" />
				</summary>
				<div className="mt-1 flex flex-col gap-2 border-t border-(--border-color) pt-2 leading-relaxed">
					<span>{t(($) => $.limits)}</span>
					{info}
				</div>
			</details>
			<div className="mt-auto flex flex-col gap-3 pt-3">
				<div className="min-w-0 xl:h-16">
					{currentProgress && (
						<div className="flex h-full min-w-0 flex-col justify-center gap-1 text-xs">
							<div className="flex min-w-0 items-center justify-between gap-2">
								<span className="truncate font-medium" title={title}>
									{title}
								</span>
								<span className="shrink-0 text-(--color-accent) tabular-nums">{percent}%</span>
							</div>
							<div
								aria-label={title}
								aria-valuemax={100}
								aria-valuemin={0}
								aria-valuenow={percent}
								aria-valuetext={description}
								className="h-1 shrink-0 overflow-hidden rounded-full bg-(--bg-tertiary)"
								role="progressbar"
							>
								<div
									className="h-full rounded-full bg-(--color-accent)"
									style={{ width: `${percent}%` }}
								/>
							</div>
							<div className="flex min-w-0 flex-wrap items-center justify-between gap-x-2 text-(--color-secondary)">
								<span>{description}</span>
								{isProcessing && activeCount > 0 && (
									<span>{t(($) => $.processingActive, { count: activeCount })}</span>
								)}
							</div>
						</div>
					)}
				</div>
				<Button
					className={cn(
						'w-full min-w-0',
						isProcessing ? 'bg-(--status-error)/70 hover:bg-(--status-error)/90' : 'active-btn'
					)}
					disabled={!isProcessing && (busy || !canProcess)}
					onClick={isProcessing ? onCancel : onProcess}
				>
					{isProcessing ? t(($) => $.cancelProcessing) : t(($) => $[mode].process)}
				</Button>
				<Footer
					busy={busy}
					count={count}
					isBackground={mode === 'background'}
					readyCount={readyCount}
					zipProgress={zipProgress}
					onClear={onClear}
					onDownload={onDownload}
				/>
			</div>
		</div>
	);
};
