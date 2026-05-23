export const TabFooter = () => {
	const currentYear = new Date().getFullYear();

	return (
		<div className="py-0 pb-2 text-center xl:py-2">
			<span className="text-xs text-(--color-secondary) opacity-50 transition-colors duration-500 ease-in-out select-none hover:text-(--color-accent) md:text-base">
				© {currentYear} Designed & Developed by Evgeniy Letunov
			</span>
		</div>
	);
};
