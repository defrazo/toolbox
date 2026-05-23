import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronRight } from 'lucide-react';

import { cn } from '@/shared/lib/utils';

import { SectionTitle } from '.';

type FaqItem = { id: string; question: string; answer: string };

export const FaqSection = () => {
	const { t } = useTranslation('help');

	const [openFaq, setOpenFaq] = useState<string | null>(null);

	const toggleFaq = (id: string) => setOpenFaq((prev) => (prev === id ? null : id));

	const faqArray = t(($) => $.faq, { returnObjects: true }) as FaqItem[];

	return (
		<section className="core-gap flex flex-1 flex-col">
			<SectionTitle>{t(($) => $.sections.faq)}</SectionTitle>
			<div className="core-gap flex flex-col">
				{faqArray.map(({ id, question, answer }) => (
					<button
						key={id}
						className="core-border core-pad flex cursor-pointer flex-col bg-(--bg-secondary)/50 text-left shadow-(--shadow) focus-visible:border-(--accent-primary-hover) focus-visible:outline-none"
						style={{ overflow: 'visible' }}
						type="button"
						onClick={() => toggleFaq(id)}
					>
						<div className="flex items-center justify-between">
							<span className="font-medium">{question}</span>
							<ChevronRight
								className={cn(
									'text-sm text-(--color-secondary) transition-transform duration-300 hover:text-(--color-accent)',
									openFaq === id ? 'rotate-90' : 'rotate-0'
								)}
							/>
						</div>
						<div
							className={cn(
								'overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out',
								openFaq === id ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
							)}
						>
							<span className="mt-2 block rounded-xl bg-(--bg-tertiary)/70 px-3 py-2 leading-tight text-(--color-secondary)">
								{answer}
							</span>
						</div>
					</button>
				))}
			</div>
		</section>
	);
};
