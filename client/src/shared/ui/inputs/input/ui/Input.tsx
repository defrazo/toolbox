import { type InputHTMLAttributes, type ReactNode, useEffect, useRef } from 'react';

import { getComponentStyles, sizes, variants } from '@/shared/lib/design';
import { cn } from '@/shared/lib/utils';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
	leftIcon?: ReactNode;
	rightIcon?: ReactNode;
	error?: boolean;
	variant?: keyof typeof variants.input;
	size?: keyof typeof sizes.input;
	justify?: 'start' | 'center' | 'end';
	wheelStep?: boolean;
}

export const Input = ({
	leftIcon,
	rightIcon,
	error = false,
	variant = 'default',
	size = 'md',
	justify,
	className,
	wheelStep = false,
	...props
}: InputProps) => {
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		const input = inputRef.current;
		if (!wheelStep || !input) return;

		const wheel = (event: WheelEvent) => {
			if (
				input.disabled ||
				input.readOnly ||
				!['number', 'range'].includes(input.type) ||
				event.ctrlKey ||
				!event.deltaY ||
				Math.abs(event.deltaX) > Math.abs(event.deltaY)
			)
				return;

			const previous = input.value;
			const direction = event.deltaY < 0 ? 1 : -1;

			if (input.step === 'any') {
				const value = Number.isFinite(input.valueAsNumber) ? input.valueAsNumber : 0;
				const minimum = input.min === '' ? -Infinity : Number(input.min);
				const maximum = input.max === '' ? Infinity : Number(input.max);
				input.value = String(Math.min(maximum, Math.max(minimum, value + direction)));
			} else {
				input.stepUp(direction);
			}

			const next = input.value;
			if (next === previous) return;

			event.preventDefault();

			input.value = previous;

			Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!.call(input, next);
			input.dispatchEvent(new Event('input', { bubbles: true }));
		};

		input.addEventListener('wheel', wheel, { passive: false });
		return () => input.removeEventListener('wheel', wheel);
	}, [wheelStep]);

	const styles = getComponentStyles({ variant, size, error, disabled: props.disabled, component: 'input' });

	const justifies = {
		start: 'justify-start',
		center: 'justify-center',
		end: 'justify-end',
	};

	const iconPadding = {
		leftPadding: leftIcon ? 'pl-10' : '',
		rightPadding: rightIcon ? 'pr-10' : '',
	};

	return (
		<div className={cn('relative z-20 flex w-full items-center', justify && justifies[justify])}>
			{leftIcon && <span className="absolute left-0 px-1.5">{leftIcon}</span>}
			{rightIcon && <span className="absolute right-0 z-30 px-1.5">{rightIcon}</span>}
			<input
				ref={inputRef}
				className={cn(styles, iconPadding.leftPadding, iconPadding.rightPadding, className)}
				{...props}
			/>
		</div>
	);
};
