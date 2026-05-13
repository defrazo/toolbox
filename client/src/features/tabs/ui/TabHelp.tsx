import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronRight, FolderPen, LayoutDashboard, Link, Lock, Pencil, Route, Sun, UserCircle } from 'lucide-react';

import { cn } from '@/shared/lib/utils';
import { Divider } from '@/shared/ui';

export const TabHelp = () => {
	const { t } = useTranslation('help');

	const [openFaq, setOpenFaq] = useState<number | null>(null);

	const toggleFaq = (index: number) => setOpenFaq((prev) => (prev === index ? null : index));

	const gettingStarted = [
		{
			title: t(($) => $.intro.toolbox.title),
			desc: t(($) => $.intro.toolbox.desc),
			icon: LayoutDashboard,
		},
		{
			title: t(($) => $.intro.interface.title),
			desc: t(($) => $.intro.interface.desc),
			icon: Route,
		},
	];

	const toolsHelp = [
		{
			id: 'renamer',
			title: t(($) => $.tools.renamer.title),
			subtitle: t(($) => $.tools.renamer.subtitle),
			icon: FolderPen,
			steps: t(($) => $.tools.renamer.steps, { returnObjects: true }),
			hints: t(($) => $.tools.renamer.hints, { returnObjects: true }),
		},
		{
			id: 'shortener',
			title: t(($) => $.tools.shortener.title),
			subtitle: t(($) => $.tools.shortener.subtitle),
			icon: Link,
			steps: t(($) => $.tools.shortener.steps, { returnObjects: true }),
			hints: [],
		},
	];

	const accountTips = [
		{
			title: t(($) => $.account.avatar.title),
			text: t(($) => $.account.avatar.text),
			icon: UserCircle,
		},
		{
			title: t(($) => $.account.profile.title),
			text: t(($) => $.account.profile.text),
			icon: Pencil,
		},
		{
			title: t(($) => $.account.password.title),
			text: t(($) => $.account.password.text),
			icon: Lock,
		},
		{
			title: t(($) => $.account.appearance.title),
			text: t(($) => $.account.appearance.text),
			icon: Sun,
		},
	];

	const faqArray = t(($) => $.faq, { returnObjects: true });

	return (
		<div className="hide-scrollbar flex h-full min-h-0 flex-col gap-8 overflow-auto">
			<section className="flex flex-1 flex-col gap-4">
				<h2 className="text-lg leading-4 text-(--color-secondary) opacity-70 select-none">
					{t(($) => $.sections.intro)}
				</h2>
				<div className="flex flex-col gap-4 2xl:flex-row">
					{gettingStarted.map(({ title, desc, icon: Icon }) => {
						return (
							<div
								key={title}
								className="core-border flex flex-1 items-center gap-4 bg-(--bg-secondary)/50 p-5"
							>
								<div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-(--accent-primary-dark) p-3">
									<Icon className="size-full text-(--color-accent)" />
								</div>
								<div className="flex flex-col">
									<span className="font-medium">{title}</span>
									<span className="text-sm leading-tight text-(--color-secondary)">{desc}</span>
								</div>
							</div>
						);
					})}
				</div>
			</section>
			<section className="flex flex-1 flex-col gap-4">
				<h2 className="text-lg leading-4 text-(--color-secondary) opacity-70 select-none">
					{t(($) => $.sections.tools)}
				</h2>
				<div className="flex flex-col gap-4">
					{toolsHelp.map(({ id, title, subtitle, steps, icon: Icon, hints }) => {
						return (
							<div
								key={id}
								className="core-border flex flex-col gap-4 bg-(--bg-secondary)/50 p-5 2xl:flex-row"
							>
								<div className="flex min-w-xl flex-1 items-center gap-4">
									<div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-(--accent-primary-dark) p-3">
										<Icon className="size-full text-(--color-accent)" />
									</div>
									<div className="flex flex-col">
										<span className="text-xl font-medium">{title}</span>
										<span className="text-justify text-sm leading-tight text-(--color-secondary)">
											{subtitle}
										</span>
									</div>
								</div>
								<div className="hidden h-full w-px bg-(--border-color) 2xl:block" />
								<div className="flex flex-2 flex-col gap-3">
									{steps.map((step, idx) => (
										<div key={idx} className="flex items-center gap-3">
											<div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-(--accent-primary-dark) text-xs">
												{idx + 1}
											</div>
											<span className="leading-tight font-light">{step}</span>
										</div>
									))}
									{hints.length !== 0 && (
										<div className="flex flex-col gap-1 rounded-lg bg-(--bg-tertiary)/70 px-4 py-3">
											{hints.map((hint, idx) => (
												<span
													key={idx}
													className="text-sm leading-tight text-(--color-secondary)"
												>
													{hint}
												</span>
											))}
										</div>
									)}
								</div>
							</div>
						);
					})}
				</div>
			</section>
			<section className="flex flex-1 flex-col gap-4">
				<h2 className="text-lg leading-4 text-(--color-secondary) opacity-70 select-none">
					{t(($) => $.sections.account)}
				</h2>
				<div className="flex flex-col gap-4 xl:flex-row">
					{accountTips.map(({ title, text, icon: Icon }) => (
						<div
							key={text}
							className="core-border flex flex-1 flex-col items-center gap-3 bg-(--bg-secondary)/50 px-4 py-3"
						>
							<div className="mr-auto flex items-center gap-2">
								<Icon className="mt-0.5 size-5 shrink-0 text-(--color-accent)" />
								<span>{title}</span>
							</div>
							<Divider />
							<span className="px-5 text-center text-sm leading-tight">{text}</span>
						</div>
					))}
				</div>
			</section>
			<section className="flex flex-1 flex-col gap-4">
				<h2 className="text-lg leading-4 text-(--color-secondary) opacity-70 select-none">
					{t(($) => $.sections.faq)}
				</h2>
				<div className="flex flex-col gap-4">
					{faqArray.map(({ question, answer }, idx) => {
						const isOpen = openFaq === idx;

						return (
							<div
								key={question}
								className="core-border flex cursor-pointer flex-col bg-(--bg-secondary)/50 px-3 py-2"
								onClick={() => toggleFaq(idx)}
							>
								<div className="flex items-center justify-between">
									<span className="font-medium">{question}</span>
									<ChevronRight
										className={cn(
											'text-sm text-(--color-secondary) transition-transform duration-300 hover:text-(--color-accent)',
											isOpen ? 'rotate-90' : 'rotate-0'
										)}
									/>
								</div>
								<div
									className={cn(
										'overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out',
										isOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
									)}
								>
									<span className="block text-sm leading-tight text-(--color-secondary)">
										{answer}
									</span>
								</div>
							</div>
						);
					})}
				</div>
			</section>
		</div>
	);
};
