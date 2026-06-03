import React from 'react';
import { useTranslation } from 'react-i18next';
import {
	ArrowRight,
	CloudDownload,
	CloudUpload,
	FileSearchCorner,
	FolderPen,
	Link,
	Link2,
	RectangleEllipsis,
	Share2,
	TextCursorInput,
} from 'lucide-react';

import { SectionTitle } from '.';

const toolsIconMap = {
	CloudUpload: CloudUpload,
	RectangleEllipsis: RectangleEllipsis,
	FileSearchCorner: FileSearchCorner,
	CloudDownload: CloudDownload,
	TextCursorInput: TextCursorInput,
	Link2: Link2,
	Share2: Share2,
} as const;

type ToolIconKey = keyof typeof toolsIconMap;

type Step = {
	id: string;
	title: string;
	subtitle: string;
	icon: ToolIconKey;
};

export const ToolsSection = () => {
	const { t } = useTranslation('help');

	const tools = [
		{
			id: 'renamer',
			title: t(($) => $.tools.renamer.title),
			subtitle: t(($) => $.tools.renamer.subtitle),
			icon: FolderPen,
			steps: t(($) => $.tools.renamer.steps, { returnObjects: true }) as unknown as Step[],
		},
		{
			id: 'shortener',
			title: t(($) => $.tools.shortener.title),
			subtitle: t(($) => $.tools.shortener.subtitle),
			icon: Link,
			steps: t(($) => $.tools.shortener.steps, { returnObjects: true }) as unknown as Step[],
		},
	];

	return (
		<section className="core-gap flex flex-1 flex-col">
			<SectionTitle>{t(($) => $.sections.tools)}</SectionTitle>
			<div className="core-gap flex flex-col">
				{tools.map(({ id, title, subtitle, steps, icon: Icon }) => (
					<div
						key={id}
						className="core-border core-pad flex flex-col bg-(--bg-secondary)/50 shadow-(--shadow) 2xl:flex-row"
					>
						<div className="core-gap flex w-fit items-center xl:w-md">
							<div className="hidden size-14 shrink-0 items-center justify-center rounded-xl bg-(--accent-primary-dark) p-3 xl:flex">
								<Icon className="size-full text-(--color-accent)" />
							</div>
							<div className="flex flex-col gap-2 xl:gap-0">
								<div className="flex items-center gap-2">
									<Icon className="size-5 text-(--color-accent) xl:hidden" />
									<span className="font-medium xl:text-xl">{title}</span>
								</div>
								<span className="text-justify text-sm leading-tight text-(--color-secondary)">
									{subtitle}
								</span>
							</div>
						</div>
						<div className="my-2 size-0 bg-(--border-color) 2xl:mx-5 2xl:mt-0 2xl:mb-0 2xl:h-full 2xl:w-px" />
						<div className="flex flex-1 flex-col items-center gap-2 xl:flex-row xl:items-start">
							{steps.map(({ id, title, subtitle, icon }, idx) => {
								const Icon = toolsIconMap[icon];
								return (
									<React.Fragment key={id}>
										<div
											key={id}
											className="flex w-full flex-1 flex-col items-center gap-2 md:max-w-80 xl:w-auto xl:max-w-52 xl:pt-2.5"
										>
											<div className="core-border relative w-full bg-(--accent-primary-dark)/30 p-4 2xl:p-6">
												<Icon className="mx-auto size-14 text-(--color-accent) 2xl:size-16" />
												<div className="absolute top-1 left-1 flex size-5 shrink-0 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-(--color-accent)/70 text-sm font-bold text-(--accent-primary-text) backdrop-blur-md 2xl:size-8">
													{idx + 1}
												</div>
											</div>
											<div className="flex flex-col text-center">
												<span className="font-medium">{title}</span>
												<span className="text-sm leading-tight text-(--color-secondary)">
													{subtitle}
												</span>
											</div>
										</div>
										{idx !== steps.length - 1 && (
											<div className="flex rotate-90 items-start xl:rotate-0 xl:pt-11 2xl:pt-16">
												<ArrowRight className="text-(--color-accent)/50" />
											</div>
										)}
									</React.Fragment>
								);
							})}
						</div>
					</div>
				))}
			</div>
		</section>
	);
};
