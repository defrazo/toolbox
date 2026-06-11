import { useTranslation } from 'react-i18next';
import { LinkIcon } from 'lucide-react';

export const EmptyState = () => {
	const { t } = useTranslation('links');

	return (
		<div className="flex h-full flex-col items-center justify-center gap-2 text-(--color-accent)">
			<LinkIcon className="size-14 animate-pulse" />
			<div className="flex flex-col items-center text-lg font-medium">
				<span className="animate-pulse">{t(($) => $.empty.title)}</span>
				<span className="text-center text-sm text-(--color-tertiary)">{t(($) => $.empty.subtitle)}</span>
			</div>
		</div>
	);
};
