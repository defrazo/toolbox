import { IconLogo } from '@/shared/assets/images';

export const AuthFormHeader = ({ title }: { title: string }) => {
	return (
		<div className="flex w-full flex-col gap-2">
			<div className="flex flex-col items-center gap-2">
				<div className="rounded-3xl bg-linear-to-br from-[#5b5cff]/20 via-[#7a5cff]/20 to-[#4da3ff]/20 p-3">
					<img alt="Логотип" className="size-10" decoding="async" loading="lazy" src={IconLogo} />
				</div>
				<h2 className="text-center text-2xl font-semibold">{title}</h2>
			</div>
		</div>
	);
};
