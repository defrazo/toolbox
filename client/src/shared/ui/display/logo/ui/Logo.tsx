import { IconLogo } from '@/shared/assets/images';
import { cn } from '@/shared/lib/utils';

const Logo = ({ className }: { className?: string }) => {
	return (
		<div className={cn('top-4 left-4 mb-4 flex items-center gap-2 select-none', className)}>
			<img alt="Логотип" className="size-6" decoding="async" loading="lazy" src={IconLogo} />
			<h1 className="text-2xl">
				Tool<span className="text-[#5b5cff]">Box</span>
			</h1>
		</div>
	);
};

export default Logo;
