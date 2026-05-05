interface TabTitleProps {
	title: string;
	subtitle: string;
	icon: React.ElementType;
	className?: string;
}

export const TabTitle = ({ title, subtitle, icon: Icon, className }: TabTitleProps) => {
	return (
		<div className={className}>
			<div className="flex items-center gap-2">
				<div className="rounded-xl bg-linear-to-br from-[#5b5cff]/20 via-[#7a5cff]/20 to-[#4da3ff]/20 p-3">
					<Icon className="size-6 text-[#6884ff]" />
				</div>
				<div className="flex flex-col gap-2">
					<h1 className="text-2xl leading-4 font-semibold select-none xl:text-3xl">{title}</h1>
					<span className="leading-4 text-(--color-secondary)">{subtitle}</span>
				</div>
			</div>
		</div>
	);
};
