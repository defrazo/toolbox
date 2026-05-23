import type { LucideIcon } from 'lucide-react';

interface TabTitleProps {
	title: string;
	subtitle: string;
	icon: LucideIcon;
}

export const TabTitle = ({ title, subtitle, icon: Icon }: TabTitleProps) => {
	return (
		<div className="core-gap flex h-8 items-center md:h-12">
			<div className="rounded-xl bg-(--accent-primary-dark) p-2 lg:p-3">
				<Icon className="size-5 text-(--color-accent) md:size-8" />
			</div>
			<div className="flex flex-col justify-between select-none">
				<h1 className="text-lg font-semibold md:text-2xl md:leading-tight xl:text-3xl">{title}</h1>
				<span className="hidden text-sm text-(--color-secondary) md:block xl:text-base">{subtitle}</span>
			</div>
		</div>
	);
};
