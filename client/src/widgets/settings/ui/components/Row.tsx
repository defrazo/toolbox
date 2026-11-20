import type { PropsWithChildren } from 'react';
import type { LucideIcon } from 'lucide-react';

interface RowProps extends PropsWithChildren {
	icon: LucideIcon;
	label: string;
	htmlFor?: string;
}

export const Row = ({ icon: Icon, label, htmlFor, children }: RowProps) => {
	const LabelTag = htmlFor ? 'label' : 'div';

	return (
		<div className="flex flex-col items-center gap-1 lg:flex-row">
			<LabelTag className="flex w-full items-center gap-2" htmlFor={htmlFor}>
				<Icon className="hidden size-5 md:block" />
				{label}
			</LabelTag>
			{children}
		</div>
	);
};
