import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ExternalLink, HelpCircle, HomeIcon, Undo2 } from 'lucide-react';

import { NotFound } from '@/shared/assets/images';
import { usePageTitle } from '@/shared/lib/hooks';
import { Logo } from '@/shared/ui';

const NotFoundPage = () => {
	const { t } = useTranslation('notFound');
	const navigate = useNavigate();

	usePageTitle(t(($) => $.title.line));

	const buttons = [
		{
			id: 'home',
			title: t(($) => $.buttons.home.title),
			subtitle: t(($) => $.buttons.home.subtitle),
			icon: HomeIcon,
			action: () => navigate('/'),
		},
		{
			id: 'back',
			title: t(($) => $.buttons.back.title),
			subtitle: t(($) => $.buttons.back.subtitle),
			icon: Undo2,
			action: () => (window.history.length > 2 ? navigate(-1) : navigate('/')),
		},
	];
	return (
		<div className="relative m-4 flex flex-1 flex-col overflow-hidden rounded-xl border border-[#fafafa12] p-3 select-none xl:p-12">
			<div className="absolute top-0 right-0 size-100 translate-x-1/2 -translate-y-1/2 rounded-full bg-(--bg-blob)/40 blur-[120px]" />
			<div className="absolute bottom-0 left-0 size-100 -translate-x-1/2 translate-y-1/2 rounded-full bg-(--bg-blob)/40 blur-[120px]" />
			<Logo className="mb-0" />
			<div className="flex flex-1 flex-col items-center justify-around lg:flex-row-reverse">
				<div className="flex flex-1 items-center justify-center xl:h-full xl:items-end xl:justify-end 2xl:pr-24">
					<img
						alt="404"
						className="max-h-[80vh] max-w-full object-contain"
						decoding="async"
						loading="lazy"
						src={NotFound}
					/>
				</div>
				<div className="flex flex-1 flex-col gap-6 lg:max-w-md xl:max-w-lg 2xl:max-w-xl 2xl:pl-24">
					<h1 className="text-center text-4xl font-semibold text-[#f4f7fb] lg:text-left lg:text-6xl">
						{t(($) => $.title.line1)}
						<br />
						<span className="text-(--color-accent)">{t(($) => $.title.line2Accent)}</span>
					</h1>
					<h2 className="text-center text-base whitespace-pre-line text-(--color-tertiary) lg:text-left lg:text-xl">
						{t(($) => $.subtitle)}
					</h2>
					<div className="core-border core-pad core-gap flex flex-col bg-[#fafafa0d]/70">
						<span className="text-(--color-accent)">{t(($) => $.actionsTitle)}</span>
						{buttons.map(({ id, title, subtitle, icon: Icon, action }) => {
							return (
								<button
									key={id}
									className="group core-gap relative flex flex-1 cursor-pointer items-center text-left transition-transform duration-300 ease-in-out hover:translate-x-1"
									type="button"
									onClick={action}
								>
									<div className="aspect-square size-10 rounded-xl bg-(--accent-primary-dark) p-2">
										<Icon className="size-full text-(--color-accent)" />
									</div>
									<div className="flex flex-col">
										<span className="text-base font-semibold text-[#f4f7fb] transition-colors group-hover:text-(--accent-primary-hover) xl:text-lg">
											{title}
										</span>
										<span className="text-xs text-(--color-secondary) xl:text-sm">{subtitle}</span>
									</div>
									<ChevronRight className="absolute top-1/2 right-2 size-5 -translate-y-1/2 text-(--color-secondary) group-hover:text-(--accent-primary-hover) xl:size-7" />
								</button>
							);
						})}
					</div>
					<div className="xl:mt-none mt-auto flex gap-2">
						<div className="flex items-center gap-2 text-sm text-(--color-tertiary) xl:text-base">
							<HelpCircle className="size-5" /> {t(($) => $.help.title)}
						</div>
						<a
							className="flex items-center gap-2 text-(--color-accent) hover:underline"
							href="mailto:defrazo@inbox.ru"
						>
							{t(($) => $.help.contact)}
							<ExternalLink className="hidden size-5 md:block" />
						</a>
					</div>
				</div>
			</div>
		</div>
	);
};

export default NotFoundPage;
