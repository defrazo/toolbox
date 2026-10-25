import { useTranslation } from 'react-i18next';

export const AuthDivider = () => {
	const { t } = useTranslation('auth');

	return (
		<div className="flex w-full items-center select-none">
			<div className="mt-px h-px w-full animate-pulse bg-linear-to-l from-(--color-accent)/50" />
			<span className="trim px-2 text-(--accent-primary-text) xl:px-4">{t(($) => $.common.form.divider)}</span>
			<div className="mt-px h-px w-full animate-pulse bg-linear-to-r from-(--color-accent)/50" />
		</div>
	);
};
