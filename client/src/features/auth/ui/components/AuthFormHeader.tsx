import { IconLogo } from '@/shared/assets/images';

export const AuthFormHeader = ({ title }: { title: string }) => {
	return (
		<div className="flex w-full flex-col gap-2">
			<div className="flex flex-col items-center gap-2 select-none">
				<div className="rounded-3xl bg-(--accent-primary-dark) p-3">
					<img alt="Логотип" className="size-10" decoding="async" loading="lazy" src={IconLogo} />
				</div>
				<h2 className="text-center text-2xl font-semibold">{title}</h2>
			</div>
		</div>
	);
};
