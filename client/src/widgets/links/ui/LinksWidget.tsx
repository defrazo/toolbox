import { type ReactNode, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { type ShortLink, shortLinksApi } from '@/entities/short-link';
import { useCopy } from '@/shared/lib/hooks';
import { cn } from '@/shared/lib/utils';
import { Preloader } from '@/shared/ui';

import { TABLE_GRID } from '../model/constants';
import { ConfirmDialog, EmptyState, LinkActions, LinksFooter, LinksTable } from './components';

interface LinksWidgetProps {
	isDemo: boolean;
	onNotice: (message: string, type: 'success' | 'error') => void;
	onOpenConfirm: (content: ReactNode) => void;
	onCloseConfirm: () => void;
}

export const LinksWidget = ({ isDemo, onNotice, onOpenConfirm, onCloseConfirm }: LinksWidgetProps) => {
	const { t } = useTranslation('links');

	const copy = useCopy((message) => onNotice(message, 'success'));
	const copyLink = (text: string) =>
		copy(
			text,
			t(($) => $.success.linkCopied)
		);

	const [isFetching, setIsFetching] = useState(false);
	const [pendingId, setPendingId] = useState<number | null>(null);

	const [links, setLinks] = useState<ShortLink[]>([]);

	const tableTitles = [
		{ id: 'shortUrl', title: t(($) => $.table.title.shortUrl), style: 'text-left' },
		{ id: 'originalUrl', title: t(($) => $.table.title.originalUrl), style: 'text-left' },
		{ id: 'createdAt', title: t(($) => $.table.title.createdAt), style: 'text-center' },
		{ id: 'ttl', title: t(($) => $.table.title.ttl), style: 'text-center' },
		{ id: 'clicks', title: t(($) => $.table.title.clicks), style: 'text-center' },
		{ id: 'actions', title: t(($) => $.table.title.actions), style: 'text-center' },
	];

	const openDeleteConfirm = (id: number) => {
		const link = links.find((link) => link.id === id);
		if (!link) return;

		onOpenConfirm(
			<ConfirmDialog link={link.shortUrl} onCancel={onCloseConfirm} onConfirm={() => handleDelete(id)} />
		);
	};

	const fetchLinks = async () => {
		if (isFetching) return;

		setIsFetching(true);

		try {
			const links = await shortLinksApi.getLinks();

			setLinks(links);
		} catch {
			onNotice(
				t((t) => t.errors.default),
				'error'
			);
		} finally {
			setIsFetching(false);
		}
	};

	const handleLock = async (id: number) => {
		if (pendingId !== null) return;

		const link = links.find((l) => l.id === id);
		if (!link) return;

		const nextLocked = !link.locked;

		setPendingId(id);
		setLinks((prev) => prev.map((link) => (link.id === id ? { ...link, locked: nextLocked } : link)));

		try {
			const updatedLink = await shortLinksApi.updateLink(id, { locked: nextLocked });

			setLinks((prev) => prev.map((link) => (link.id === id ? updatedLink : link)));
		} catch {
			setLinks((prev) => prev.map((link) => (link.id === id ? { ...link, locked: !nextLocked } : link)));

			onNotice(
				t((t) => t.errors.default),
				'error'
			);
		} finally {
			setPendingId(null);
		}
	};

	const handleDelete = async (id: number) => {
		if (pendingId !== null) return;

		setPendingId(id);

		try {
			await shortLinksApi.deleteLink(id);

			setLinks((prev) => prev.filter((link) => link.id !== id));
		} catch {
			onNotice(
				t((t) => t.errors.default),
				'error'
			);
		} finally {
			setPendingId(null);
			onCloseConfirm();
		}
	};

	useEffect(() => void fetchLinks(), []);

	return (
		<>
			<div
				className={cn(
					'core-border core-pad hidden bg-(--bg-secondary)/50 font-medium text-(--color-primary) select-none xl:grid',
					TABLE_GRID
				)}
			>
				{tableTitles.map(({ id, title, style }) => {
					return (
						<span key={id} className={cn(style)}>
							{title}
						</span>
					);
				})}
			</div>
			<div className="hide-scrollbar min-h-0 flex-1 overflow-y-auto xl:-mt-4 xl:px-4">
				{links.length === 0 && !isFetching && <EmptyState />}
				{isFetching ? (
					<div className="flex h-full items-center justify-center">
						<Preloader className="size-15 border-(--accent-primary) border-t-(--border-color)" />
					</div>
				) : (
					<LinksTable
						links={links}
						renderActions={(link) => (
							<LinkActions
								link={link}
								pendingId={pendingId}
								onDelete={openDeleteConfirm}
								onDownloaded={() =>
									onNotice(
										t(($) => $.success.qrDownloaded),
										'success'
									)
								}
								onLock={handleLock}
							/>
						)}
						onCopy={copyLink}
					/>
				)}
			</div>
			<LinksFooter isDemo={isDemo} isLoading={isFetching} onRefresh={fetchLinks} />
		</>
	);
};
