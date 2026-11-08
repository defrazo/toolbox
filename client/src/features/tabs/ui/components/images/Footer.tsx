import { useTranslation } from 'react-i18next';
import { Download, Trash2 } from 'lucide-react';

import { Button } from '@/shared/ui';

import { IMAGES } from '../../../model';

interface FooterProps {
	count: number;
	readyCount: number;
	busy: boolean;
	isBackground: boolean;
	onClear: () => void;
	onDownload: () => void;
}

export const Footer = ({ count, readyCount, busy, isBackground, onClear, onDownload }: FooterProps) => {
	const { t } = useTranslation('images');

	const isCancelling = isBackground && busy;

	return (
		<div className="flex flex-col gap-3 border-t border-(--border-color) pt-3">
			<Button
				className="active-btn w-full min-w-0"
				disabled={busy || readyCount === 0}
				leftIcon={<Download className="size-4" />}
				onClick={onDownload}
			>
				{t(($) => $.download, { count: readyCount })}
			</Button>
			<div className="flex flex-wrap items-center justify-between gap-2">
				<div className="h-8 rounded-lg bg-(--accent-primary-dark) px-3 py-1.5 text-center text-sm text-(--color-accent) select-none">
					{t(($) => $.selected, { count })} / {IMAGES.MAX_FILES}
				</div>
				<Button
					className="h-8 rounded-lg"
					disabled={(!isBackground && busy) || count === 0}
					leftIcon={<Trash2 className="size-4" />}
					onClick={onClear}
				>
					<span className="truncate">{isCancelling ? t(($) => $.background.cancel) : t(($) => $.clear)}</span>
				</Button>
			</div>
		</div>
	);
};
