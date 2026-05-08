interface TabTitleProps {
	title: string;
	subtitle: string;
	icon: React.ElementType;
}

export const TabTitle = ({ title, subtitle, icon: Icon }: TabTitleProps) => {
	return (
		<div className="flex h-12 items-center gap-4">
			<div className="rounded-xl bg-(--accent-primary-dark) p-2">
				<Icon className="size-8 text-(--color-accent)" />
			</div>
			<div className="flex h-full flex-col justify-between pt-0.5 select-none">
				<h1 className="text-2xl leading-4 font-semibold xl:text-3xl">{title}</h1>
				<span className="leading-4 text-(--color-secondary)">{subtitle}</span>
			</div>
		</div>
	);
};
