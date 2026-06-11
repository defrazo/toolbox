import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';

import { useStore } from '@/app/providers';
import { cn } from '@/shared/lib/utils';
import { Preloader } from '@/shared/ui';

import { linksApi } from '../api';
import { type ShortLink, TABLE_GRID } from '../model';
import { ConfirmDialog, EmptyState, LinksFooter, LinksTable } from './components/links';

export const TabLinks = observer(() => {
	const { t } = useTranslation('links');

	const { userStore, notifyStore } = useStore();

	const [isFetching, setIsFetching] = useState(false);
	const [pendingId, setPendingId] = useState<number | null>(null);

	const [deleteLink, setDeleteLink] = useState<number | null>(null);
	const [links, setLinks] = useState<ShortLink[]>([]);

	const tableTitles = [
		{ id: 'shortUrl', title: t(($) => $.table.title.shortUrl), style: 'text-left' },
		{ id: 'originalUrl', title: t(($) => $.table.title.originalUrl), style: 'text-left' },
		{ id: 'createdAt', title: t(($) => $.table.title.createdAt), style: 'text-center' },
		{ id: 'ttl', title: t(($) => $.table.title.ttl), style: 'text-center' },
		{ id: 'clicks', title: t(($) => $.table.title.clicks), style: 'text-center' },
		{ id: 'actions', title: t(($) => $.table.title.actions), style: 'text-center' },
	];

	const fetchLinks = async () => {
		if (isFetching) return;

		setIsFetching(true);

		try {
			const links = await linksApi.getLinks();

			setLinks(links);
		} catch {
			notifyStore.setNotice(
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
			const updatedLink = await linksApi.updateLink(id, { locked: nextLocked });

			setLinks((prev) => prev.map((link) => (link.id === id ? updatedLink : link)));
		} catch {
			setLinks((prev) => prev.map((link) => (link.id === id ? { ...link, locked: !nextLocked } : link)));

			notifyStore.setNotice(
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
			await linksApi.deleteLink(id);

			setLinks((prev) => prev.filter((link) => link.id !== id));
			setDeleteLink(null);
		} catch {
			notifyStore.setNotice(
				t((t) => t.errors.default),
				'error'
			);
		} finally {
			setPendingId(null);
			setDeleteLink(null);
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
					<LinksTable links={links} pendingId={pendingId} onDelete={setDeleteLink} onLock={handleLock} />
				)}
			</div>
			<LinksFooter isDemo={userStore.isDemo} isLoading={isFetching} onRefresh={fetchLinks} />
			{deleteLink !== null && (
				<ConfirmDialog
					isPending={pendingId !== null}
					link={links.find((link) => link.id === deleteLink)?.shortUrl}
					onCancel={() => setDeleteLink(null)}
					onConfirm={() => handleDelete(deleteLink)}
				/>
			)}
		</>
	);
});
