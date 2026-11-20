import type { ReactNode } from 'react';

import type { ShortLink } from '@/entities/short-link';
import { useDeviceType } from '@/shared/lib/hooks';

import { LinkCard } from './LinkCard';
import { LinkRow } from './LinkRow';

interface LinksTableProps {
	links: ShortLink[];
	renderActions: (link: ShortLink) => ReactNode;
	onCopy: (text: string) => void;
}

export const LinksTable = ({ links, renderActions, onCopy }: LinksTableProps) => {
	const device = useDeviceType();

	return (
		<>
			{links.map((link) =>
				device === 'desktop' ? (
					<LinkRow key={link.id} actions={renderActions(link)} link={link} onCopy={onCopy} />
				) : (
					<LinkCard key={link.id} actions={renderActions(link)} link={link} onCopy={onCopy} />
				)
			)}
		</>
	);
};
