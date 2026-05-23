import { type AnchorHTMLAttributes, forwardRef, MouseEvent, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

import { getComponentStyles, sizes, variants } from '@/shared/lib/design';
import { cn } from '@/shared/lib/utils';
import { Preloader } from '@/shared/ui';

interface ButtonLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
	to?: string;
	href?: string;
	loading?: boolean;
	active?: boolean;
	leftIcon?: ReactNode;
	centerIcon?: ReactNode;
	rightIcon?: ReactNode;
	variant?: keyof typeof variants.button;
	size?: keyof typeof sizes.button;
	error?: boolean;
}

export const ButtonLink = forwardRef<HTMLAnchorElement, ButtonLinkProps>(
	(
		{
			to,
			href,
			onClick,
			loading = false,
			active = false,
			leftIcon,
			centerIcon,
			rightIcon,
			children,
			variant = 'default',
			size = 'md',
			error = false,
			className,
			target,
			rel,
			...props
		},
		ref
	) => {
		const navigate = useNavigate();
		const isDisabled = loading;

		const styles = getComponentStyles({
			variant,
			size,
			active,
			error,
			disabled: isDisabled,
			component: 'button',
		});

		const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
			if (isDisabled) {
				e.preventDefault();
				return;
			}

			if (to) {
				e.preventDefault();
				navigate(to);
			}

			onClick?.(e);
		};

		const content = loading ? (
			<Preloader className="size-6 border-3 border-t-(--border-color)" />
		) : (
			<>
				{leftIcon && <span className="mr-2">{leftIcon}</span>}
				{centerIcon ? centerIcon : children}
				{rightIcon && <span className="ml-2">{rightIcon}</span>}
			</>
		);

		return (
			<a
				ref={ref}
				className={cn(styles, className, 'group')}
				href={href}
				rel={rel}
				target={target}
				onClick={handleClick}
				{...props}
			>
				{content}
			</a>
		);
	}
);

ButtonLink.displayName = 'ButtonLink';
