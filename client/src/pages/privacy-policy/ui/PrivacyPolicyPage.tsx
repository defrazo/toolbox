import { useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { CONTACT_EMAIL } from '@/shared/config';
import { Logo, ScrollToTop } from '@/shared/ui';

import { Section } from './components';

const PrivacyPolicyPage = () => {
	const { t } = useTranslation('privacy');

	const mainRef = useRef<HTMLElement | null>(null);

	return (
		<div className="relative m-4 flex flex-1 flex-col overflow-hidden rounded-xl border border-[#fafafa12] p-3 select-none xl:p-12">
			<div className="absolute top-0 right-0 size-100 translate-x-1/2 -translate-y-1/2 rounded-full bg-(--bg-blob)/40 blur-[120px]" />
			<div className="absolute bottom-0 left-0 size-100 -translate-x-1/2 translate-y-1/2 rounded-full bg-(--bg-blob)/40 blur-[120px]" />
			<Logo className="absolute top-3 left-3 mb-0 xl:top-12 xl:left-12" />
			<ScrollToTop scrollRef={mainRef} />
			<main
				ref={mainRef}
				className="hide-scrollbar mx-auto mt-9 flex w-full max-w-3xl flex-col gap-6 overflow-y-auto xl:mt-0"
			>
				<header className="flex flex-col gap-2">
					<h1 className="text-2xl font-semibold lg:text-3xl">{t(($) => $.title)}</h1>
					<p className="text-(--color-secondary)">{t(($) => $.description)}</p>
				</header>
				<Section title={t(($) => $.dataProcessing.title)}>
					<ul className="list-disc space-y-1 pl-5 text-(--color-secondary)">
						<li>{t(($) => $.dataProcessing.email)}</li>
						<li>{t(($) => $.dataProcessing.username)}</li>
						<li>{t(($) => $.dataProcessing.auth)}</li>
					</ul>
					<p className="text-(--color-secondary)">{t(($) => $.dataProcessing.passwords)}</p>
				</Section>
				<Section title={t(($) => $.purpose.title)}>
					<ul className="list-disc space-y-1 pl-5 text-(--color-secondary)">
						<li>{t(($) => $.purpose.registration)}</li>
						<li>{t(($) => $.purpose.account)}</li>
						<li>{t(($) => $.purpose.recovery)}</li>
						<li>{t(($) => $.purpose.verification)}</li>
						<li>{t(($) => $.purpose.security)}</li>
					</ul>
				</Section>
				<Section title={t(($) => $.thirdParty.title)}>
					<p className="text-(--color-secondary)">{t(($) => $.thirdParty.text)}</p>
				</Section>
				<Section title={t(($) => $.storage.title)}>
					<p className="text-(--color-secondary)">{t(($) => $.storage.text)}</p>
				</Section>
				<Section title={t(($) => $.access.title)}>
					<p className="text-(--color-secondary)">{t(($) => $.access.text)}</p>
				</Section>
				<Section title={t(($) => $.contact.title)}>
					<p className="text-(--color-secondary)">
						{t(($) => $.contact.text)}{' '}
						<a className="text-(--accent-primary) hover:underline" href={`mailto:${CONTACT_EMAIL}`}>
							{CONTACT_EMAIL}
						</a>
					</p>
				</Section>
			</main>
		</div>
	);
};

export default PrivacyPolicyPage;
