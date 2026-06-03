import { useTranslation } from 'react-i18next';
import { Blocks } from 'lucide-react';

export const PromoCard = () => {
	const { t } = useTranslation('home');

	return (
		<div className="core-pad hidden h-fit flex-col items-start rounded-xl border border-(--accent-primary-hover-op)/50 bg-(--accent-primary)/10 transition-colors select-none xl:flex">
			<div className="flex items-center gap-2">
				<Blocks className="size-10 text-(--color-accent)" />
				<div className="flex flex-col gap-2">
					<span className="text-lg leading-4 font-semibold text-(--color-accent)">
						{t(($) => $.promo.title)}
					</span>
					<span className="leading-4 text-(--color-secondary)">{t(($) => $.promo.subtitle)}</span>
				</div>
			</div>
		</div>
	);
};
