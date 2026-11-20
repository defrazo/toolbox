import { useTranslation } from 'react-i18next';
import { Download, Square, Trash2 } from 'lucide-react';

import { Button } from '@/shared/ui';

import { IMAGES } from '../../../model';

interface FooterProps {
	count: number;
	readyCount: number;
	busy: boolean;
	zipProgress: number | null;
	isPreparing: boolean;
	onCancelPreparation: () => void;
	onClear: () => void;
	onDownload: () => void;
}

export const Footer = ({
	count,
	readyCount,
	busy,
	zipProgress,
	isPreparing,
	onCancelPreparation,
	onClear,
	onDownload,
}: FooterProps) => {
	const { t } = useTranslation('images');

	return (
		<div className="flex flex-col gap-3 border-t border-(--border-color) pt-3">
			<Button
				className="active-btn h-8 w-full min-w-0 rounded-lg"
				disabled={!isPreparing && (busy || readyCount === 0)}
				leftIcon={isPreparing ? <Square className="size-4" /> : <Download className="size-4" />}
				loading={zipProgress !== null}
				onClick={isPreparing ? onCancelPreparation : onDownload}
			>
				{isPreparing ? t(($) => $.cancelPreparation) : t(($) => $.download, { count: readyCount })}
			</Button>
			{zipProgress !== null && (
				<p className="text-xs text-(--color-secondary)" role="status">
					{t(($) => $.preparingArchive)}: {zipProgress}%
				</p>
			)}
			<div className="flex flex-wrap items-center justify-between gap-2">
				<div className="h-8 flex-1 rounded-lg bg-(--accent-primary-dark) px-3 py-1.5 text-center text-sm text-(--color-accent) select-none">
					{t(($) => $.selected, { count })} / {IMAGES.MAX_FILES}
				</div>
				<Button
					className="h-8 flex-1 rounded-lg text-sm"
					disabled={busy || count === 0}
					leftIcon={<Trash2 className="size-4" />}
					onClick={onClear}
				>
					<span className="truncate">{t(($) => $.clear)}</span>
				</Button>
			</div>
		</div>
	);
};
