import { useTranslation } from 'react-i18next';

import './loader.css';

export const PreloaderExt = () => {
	const { t } = useTranslation('common');

	return (
		<div className="flex h-full flex-1 flex-col items-center justify-center gap-2">
			<div className="loader" />
			<span className="animate-pulse text-xl font-medium text-(--color-secondary)">{t(($) => $.loadingApp)}</span>
		</div>
	);
};
