import { Logo } from '@/shared/ui';

export const AuthFormHeader = ({ title }: { title: string }) => {
	return (
		<div className="flex w-full flex-col gap-2">
			<div className="flex flex-col items-center gap-2 select-none">
				<Logo className="flex lg:hidden xl:flex" />
				<h2 className="text-center text-xl font-semibold xl:text-2xl">{title}</h2>
			</div>
		</div>
	);
};
