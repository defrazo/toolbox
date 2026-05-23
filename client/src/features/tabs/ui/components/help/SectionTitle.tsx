import type { PropsWithChildren } from 'react';

export const SectionTitle = ({ children }: PropsWithChildren) => {
	return <h2 className="text-lg leading-4 text-(--color-secondary) opacity-70 select-none">{children}</h2>;
};
