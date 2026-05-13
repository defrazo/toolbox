export const TabFooter = () => {
	return (
		<div className="py-2 text-center">
			<span className="text-xs text-(--color-secondary) opacity-50 transition-colors duration-500 ease-in-out select-none hover:text-(--color-accent) md:text-base">
				© {new Date().getFullYear()} Designed & Developed by Evgeniy Letunov
			</span>
		</div>
	);
};
