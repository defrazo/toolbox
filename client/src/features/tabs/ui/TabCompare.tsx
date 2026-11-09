import { lazy, Suspense } from 'react';
import { useTranslation } from 'react-i18next';

import { Preloader } from '@/shared/ui';

const ComparisonEditor = lazy(() => import('./components/compare/Editor'));

export const TabCompare = () => {
	const { t } = useTranslation('compare');

	return (
		<Suspense
			fallback={
				<div
					className="flex flex-1 flex-col items-center justify-center gap-1 text-(--color-secondary)"
					role="status"
				>
					<Preloader className="size-6" />
					{t(($) => $.loading)}
				</div>
			}
		>
			<ComparisonEditor />
		</Suspense>
	);
};
