import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, Copy, Infinity, Link2, Timer } from 'lucide-react';

import type { ShortLink } from '@/entities/short-link';
import { fullDate } from '@/shared/lib/utils';
import { Button } from '@/shared/ui';

import { getTtl } from '../../lib/ttl';

interface LinkCardProps {
	link: ShortLink;
	actions: ReactNode;
	onCopy: (text: string) => void;
}

export const LinkCard = ({ link, actions, onCopy }: LinkCardProps) => {
	const { t } = useTranslation('links');

	const ttl = getTtl(link.createdAt, Date.now());

	return (
		<div className="core-border flex flex-col gap-3 overscroll-auto bg-(--bg-secondary)/50 px-3 py-3 shadow-(--shadow) not-last:mb-4">
			<div className="flex items-center gap-2">
				<div className="flex size-9 items-center justify-center rounded-xl bg-(--accent-primary-dark) p-2 lg:p-3">
					<Link2 className="size-5 text-(--color-accent) md:size-8" />
				</div>
				<div className="flex flex-col">
					<a
						className="truncate text-sm font-medium hover:text-(--accent-primary) hover:underline"
						href={link.shortUrl}
						rel="noreferrer"
						target="_blank"
					>
						{link.shortUrl}
					</a>
					<span className="max-w-[55vw] truncate text-xs text-(--color-secondary)">{link.originalUrl}</span>
				</div>
				<Button
					centerIcon={
						<Copy className="size-5 text-(--color-secondary) transition-transform hover:scale-125 hover:text-(--accent-primary-hover)" />
					}
					className="ml-auto"
					size="custom"
					title={t(($) => $.table.hint.shortUrl)}
					variant="mobile"
					onClick={() => onCopy(link.shortUrl)}
				/>
			</div>
			<div className="flex items-center justify-between border-b border-(--border-color) py-4 text-sm">
				<div className="flex items-center gap-2 text-(--color-secondary)">
					<Calendar className="size-4" />
					{fullDate(link.createdAt)}
				</div>
				<div className="text-(--color-secondary)">
					{link.locked ? (
						<span title={t(($) => $.table.hint.createdAt)}>
							<Infinity className="size-5" />
						</span>
					) : ttl ? (
						<span className="flex items-center gap-1">
							<Timer className="size-4" />
							<span className="text-(--status-success)">{ttl}</span>
						</span>
					) : (
						<span className="text-(--status-error)">{t(($) => $.table.hint.expired)}</span>
					)}
				</div>
				<div className="flex size-9 items-center justify-center rounded-lg bg-(--bg-tertiary) p-1 text-sm font-medium">
					{link.clicks}
				</div>
			</div>
			{actions}
		</div>
	);
};
