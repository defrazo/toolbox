import { useTranslation } from 'react-i18next';
import { Trash2 } from 'lucide-react';

import { Button } from '@/shared/ui';

import { IMAGES } from '../../../model';

interface FooterProps {
	count: number;
	busy: boolean;
	isVectorize: boolean;
	onClear: () => void;
}

export const Footer = ({ count, busy, isVectorize, onClear }: FooterProps) => {
	const { t } = useTranslation('images');

	return (
		<div className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t border-(--border-color) pt-3">
			<div className="h-8 rounded-lg bg-(--accent-primary-dark) px-3 py-1.5 text-center text-sm text-(--color-accent) select-none">
				{t(($) => $.selected, { count })} / {IMAGES.MAX_FILES}
			</div>
			<Button
				className="h-8 rounded-lg"
				disabled={(!isVectorize && busy) || count === 0}
				leftIcon={<Trash2 className="size-4" />}
				onClick={onClear}
			>
				<span className="trim">{isVectorize && busy ? t(($) => $.vectorize.cancel) : t(($) => $.clear)}</span>
			</Button>
		</div>
	);
};
