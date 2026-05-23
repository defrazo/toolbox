import { type ButtonHTMLAttributes, forwardRef, type ReactNode } from 'react';

import { getComponentStyles, sizes, variants } from '@/shared/lib/design';
import { cn } from '@/shared/lib/utils';
import { Preloader } from '@/shared/ui';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	loading?: boolean;
	active?: boolean;
	leftIcon?: ReactNode;
	centerIcon?: ReactNode;
	rightIcon?: ReactNode;
	variant?: keyof typeof variants.button;
	size?: keyof typeof sizes.button;
	error?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
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
			disabled,
			...props
		},
		ref
	) => {
		const isDisabled = disabled || loading;

		const styles = getComponentStyles({
			variant,
			size,
			active,
			error,
			disabled: isDisabled,
			component: 'button',
		});

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
			<button ref={ref} className={cn(styles, className, 'group')} disabled={isDisabled} type="button" {...props}>
				{content}
			</button>
		);
	}
);

Button.displayName = 'Button';
