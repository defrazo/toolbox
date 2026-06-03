export const Section = ({ title, children }: { title: string; children: React.ReactNode }) => {
	return (
		<section className="flex flex-col gap-3 text-justify">
			<h2 className="text-left text-lg font-semibold lg:text-xl">{title}</h2>
			{children}
		</section>
	);
};
