import type { HTMLAttributes } from 'react';
import { ChevronDown } from 'lucide-react';

import { getComponentStyles, sizes, variants } from '@/shared/lib/design';
import { cn } from '@/shared/lib/utils';

import type { Direction, Justify, SelectExtOption } from '../model';
import { useSelect } from '../model';
import { SelectList } from '.';

interface SelectExtProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
	options: SelectExtOption[];
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
	variant?: keyof typeof variants.selectExt;
	size?: keyof typeof sizes.selectExt;
	error?: boolean;
	justify?: Justify;
	direction?: Direction;
	nullable?: boolean;
	visibleIcon?: boolean;
	visibleKey?: boolean;
	visibleDown?: boolean;
	disabled?: boolean;
	addStyle?: string;
}

const SelectExt = ({
	options,
	value,
	onChange,
	placeholder,
	variant = 'default',
	size = 'md',
	error = false,
	justify = 'start',
	direction = 'auto',
	nullable = false,
	visibleIcon = true,
	visibleKey = true,
	visibleDown = true,
	disabled = false,
	addStyle = '',
	className,
}: SelectExtProps) => {
	const { toggle, isOpen, setIsOpen, openUpwards, wrapperRef, buttonRef } = useSelect(direction);
	const selectedOption = options.find((opt) => opt.value === value);
	const isEmbedded = variant === 'embedded';

	const styles = getComponentStyles({ variant, size, error, disabled: disabled, component: 'selectExt' });

	return (
		<div ref={wrapperRef} className="relative flex">
			<button
				ref={buttonRef}
				aria-expanded={isOpen}
				aria-haspopup="listbox"
				className={cn(
					styles,
					className,
					isOpen && isEmbedded && 'border border-solid border-(--accent-primary-hover-op) transition-none',
					isOpen && (openUpwards ? isEmbedded && 'rounded-t-none' : isEmbedded && 'rounded-b-none')
				)}
				disabled={disabled}
				type="button"
				onClick={toggle}
			>
				<div className="flex flex-1 items-center justify-center gap-2">
					{visibleIcon &&
						selectedOption?.icon &&
						(typeof selectedOption.icon === 'string' ? (
							<img
								className="no-touch-callout mr-2 size-6 rounded-xl"
								decoding="async"
								loading="lazy"
								src={selectedOption.icon}
								onContextMenu={(e) => e.preventDefault()}
							/>
						) : (
							(() => {
								const Icon = selectedOption.icon;
								return <Icon className="size-6" />;
							})()
						))}
					<span
						className={cn(
							'text-center',
							visibleDown && 'pr-2',
							!selectedOption && 'text-(--color-primary)',
							isOpen && 'text-(--accent-hover)'
						)}
					>
						{selectedOption?.label ?? placeholder}
					</span>
				</div>
				{visibleDown && (
					<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
						<ChevronDown className="size-4" />
					</div>
				)}
			</button>
			{isOpen && !disabled && (
				<SelectList
					addStyle={addStyle}
					justify={justify}
					nullable={nullable}
					openUpwards={openUpwards}
					options={options}
					setIsOpen={setIsOpen}
					value={value}
					variant={variant}
					visibleKey={visibleKey}
					onChange={onChange}
				/>
			)}
		</div>
	);
};

export default SelectExt;
