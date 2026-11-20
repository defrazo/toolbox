import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Copy, Infinity, Timer } from 'lucide-react';

import type { ShortLink } from '@/entities/short-link';
import { cn, fullDate } from '@/shared/lib/utils';
import { Button } from '@/shared/ui';

import { getTtl } from '../../lib/ttl';
import { TABLE_GRID } from '../../model/constants';

interface LinkRowProps {
	link: ShortLink;
	actions: ReactNode;
	onCopy: (text: string) => void;
}

export const LinkRow = ({ link, actions, onCopy }: LinkRowProps) => {
	const { t } = useTranslation('links');

	const ttl = getTtl(link.createdAt, Date.now());

	const action = 'size-5 text-(--color-secondary) transition-transform hover:scale-125';

	return (
		<div className={cn('grid items-start border-(--border-color) not-last:border-b', TABLE_GRID)}>
			<div className="flex items-center gap-3 py-4">
				<a
					className="truncate font-medium hover:text-(--accent-primary) hover:underline"
					href={link.shortUrl}
					rel="noreferrer"
					target="_blank"
				>
					{link.shortUrl}
				</a>
				<Button
					centerIcon={<Copy className={cn('hover:text-(--accent-primary-hover)', action)} />}
					size="custom"
					title={t(($) => $.table.hint.shortUrl)}
					variant="mobile"
					onClick={() => onCopy(link.shortUrl)}
				/>
			</div>
			<div className="flex gap-3 py-4">
				<a
					className="truncate text-(--color-secondary) hover:text-(--accent-primary) hover:underline"
					href={link.originalUrl}
					rel="noreferrer"
					target="_blank"
				>
					{link.originalUrl}
				</a>
				<Button
					centerIcon={<Copy className={cn('hover:text-(--accent-primary-hover)', action)} />}
					size="custom"
					title={t(($) => $.table.hint.originalUrl)}
					variant="mobile"
					onClick={() => onCopy(link.originalUrl)}
				/>
			</div>
			<div className="mx-auto mt-0.5 flex py-4 text-sm text-(--color-secondary)">{fullDate(link.createdAt)}</div>
			<div className="mx-auto mt-0.5 py-4 text-sm text-(--color-secondary)">
				{link.locked ? (
					<span
						className="flex items-center gap-1 text-(--color-secondary)"
						title={t(($) => $.table.hint.createdAt)}
					>
						<Infinity className="size-5" />
					</span>
				) : ttl ? (
					<span className="flex items-center gap-1 text-(--status-success)">
						<Timer className="size-4 text-(--color-secondary)" />
						{ttl}
					</span>
				) : (
					<span className="text-(--status-error)">{t(($) => $.table.hint.expired)}</span>
				)}
			</div>
			<div className="mx-auto my-4 flex w-fit min-w-10 items-center justify-center rounded-lg bg-(--bg-tertiary) px-3 py-1 text-sm font-medium">
				{link.clicks}
			</div>
			{actions}
		</div>
	);
};
