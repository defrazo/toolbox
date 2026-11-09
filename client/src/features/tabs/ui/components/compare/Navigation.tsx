import { ArrowDown, ArrowUp } from 'lucide-react';

import { Button } from '@/shared/ui';

interface NavigationProps {
	status: string;
	previousLabel: string;
	nextLabel: string;
	disabled: boolean;
	onPrevious: () => void;
	onNext: () => void;
}

export const Navigation = ({ status, previousLabel, nextLabel, disabled, onPrevious, onNext }: NavigationProps) => {
	return (
		<div className="flex min-h-9 items-center justify-between gap-2 border-t border-(--border-color) px-3 py-1">
			<span aria-live="polite" className="text-xs text-(--color-secondary)" role="status">
				{status}
			</span>
			<div className="flex items-center gap-1">
				<Button
					centerIcon={<ArrowUp className="size-4" />}
					disabled={disabled}
					size="sm"
					title={previousLabel}
					onClick={onPrevious}
				/>
				<Button
					centerIcon={<ArrowDown className="size-4" />}
					disabled={disabled}
					size="sm"
					title={nextLabel}
					onClick={onNext}
				/>
			</div>
		</div>
	);
};
