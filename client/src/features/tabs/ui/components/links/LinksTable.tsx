import { useDeviceType } from '@/shared/lib/hooks';

import { type ShortLink } from '../../../model';
import { LinkCard, LinkRow } from '.';

interface LinksTableProps {
	links: ShortLink[];
	pendingId: number | null;
	onLock: (id: number) => void;
	onDelete: (id: number) => void;
}

export const LinksTable = ({ links, pendingId, onLock, onDelete }: LinksTableProps) => {
	const device = useDeviceType();

	return (
		<>
			{links.map((link) =>
				device === 'desktop' ? (
					<LinkRow key={link.id} link={link} pendingId={pendingId} onDelete={onDelete} onLock={onLock} />
				) : (
					<LinkCard key={link.id} link={link} pendingId={pendingId} onDelete={onDelete} onLock={onLock} />
				)
			)}
		</>
	);
};
