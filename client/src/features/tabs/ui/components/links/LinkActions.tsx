import { useTranslation } from 'react-i18next';
import { ExternalLink, Lock, LockOpen, QrCode, Trash2 } from 'lucide-react';

import { useStore } from '@/app/providers';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui';

import { type ShortLink, useLinksTable } from '../../../model';
import { QrCodeBlock } from '../shortener';

interface LinkActionsProps {
	link: ShortLink;
	pendingId: number | null;
	onLock: (id: number) => void;
	onDelete: (id: number) => void;
}

export const LinkActions = ({ link, pendingId, onLock, onDelete }: LinkActionsProps) => {
	const { t } = useTranslation('links');

	const { notifyStore } = useStore();
	const { openQr, qrContainerRef, toggleQr, setQrButtonRef, closeQr } = useLinksTable();

	const action = 'size-5 text-(--color-secondary) transition-transform hover:scale-125';

	const handleDownlodad = () => {
		closeQr();
		notifyStore.setNotice(
			t((t) => t.success.qrDownloaded),
			'success'
		);
	};

	return (
		<div className="relative flex justify-around gap-3 py-1 xl:items-center xl:justify-center xl:py-4">
			<Button
				centerIcon={
					link.locked ? (
						<LockOpen className={cn('hover:text-(--status-error)', action)} />
					) : (
						<Lock className={cn('hover:text-(--status-success)', action)} />
					)
				}
				className="disabled:bg-transparent"
				disabled={pendingId === link.id}
				size="custom"
				title={link.locked ? t(($) => $.table.hint.lockOpen) : t(($) => $.table.hint.lock)}
				variant="mobile"
				onClick={() => onLock(link.id)}
			/>
			<Button
				centerIcon={<ExternalLink className={cn('hover:text-(--accent-primary-hover)', action)} />}
				size="custom"
				title={t(($) => $.table.hint.open)}
				variant="mobile"
				onClick={() => window.open(link.originalUrl, '_blank', 'noreferrer')}
			/>
			<Button
				ref={setQrButtonRef(link.code)}
				centerIcon={
					<QrCode
						className={cn(
							'hover:text-(--accent-primary-hover)',
							action,
							openQr === link.code &&
								'scale-130 text-(--accent-primary-hover) hover:text-(--accent-primary-hover)'
						)}
					/>
				}
				size="custom"
				title={t(($) => $.table.hint.qr)}
				variant="mobile"
				onClick={() => toggleQr(link.code)}
			/>
			<Button
				centerIcon={<Trash2 className={cn('hover:text-(--status-error)', action)} />}
				className="disabled:bg-transparent"
				disabled={pendingId === link.id}
				size="custom"
				title={t(($) => $.table.hint.delete)}
				variant="mobile"
				onClick={() => onDelete(link.id)}
			/>
			<div
				ref={qrContainerRef}
				className={cn(
					'absolute -top-35.5 -left-3 z-10 size-fit gap-1 overflow-hidden rounded-xl bg-(--bg-dropdown) p-2 transition-[max-height,opacity] duration-300 ease-in-out xl:top-11 xl:right-2.5',
					openQr === link.code ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
				)}
			>
				<QrCodeBlock value={link.shortUrl} onDownloaded={handleDownlodad} />
			</div>
		</div>
	);
};
