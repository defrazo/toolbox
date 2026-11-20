import { IconLogo } from '@/shared/assets/images';
import { cn } from '@/shared/lib/utils';

interface LogoProps {
	className?: string;
	onClick?: () => void;
}

export const Logo = ({ className, onClick }: LogoProps) => (
	<div className={cn('top-4 left-4 mb-4 flex items-center gap-2 select-none', className)} onClick={onClick}>
		<img alt="Логотип" className="no-touch-callout size-6" decoding="async" loading="lazy" src={IconLogo} />
		<h1 className="text-2xl">
			<span className="text-(--accent-primary-text)">Tool</span>
			<span className="text-(--color-accent)">Box</span>
		</h1>
	</div>
);
