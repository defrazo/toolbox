import { useRef } from 'react';
import { ArrowRightLeft, ChevronDown, CircleHelp, Settings2, Trash2 } from 'lucide-react';

import { Button, SelectExt } from '@/shared/ui';

type Option = { value: string; label: string };
type Setting = { label: string; checked: boolean; onChange: (value: boolean) => void; hint?: string };

interface ToolbarProps {
	language: string;
	languageLabel: string;
	languageOptions: Option[];
	onLanguageChange: (value: string) => void;
	swapLabel: string;
	clearLabel: string;
	settingsLabel: string;
	disabled: boolean;
	onHelp: () => void;
	onSwap: () => void;
	onClear: () => void;
	settings: Setting[];
}

export const Toolbar = ({
	language,
	languageLabel,
	languageOptions,
	onLanguageChange,
	swapLabel,
	clearLabel,
	settingsLabel,
	disabled,
	onHelp,
	onSwap,
	onClear,
	settings,
}: ToolbarProps) => {
	const settingsRef = useRef<HTMLDetailsElement>(null);

	return (
		<div className="core-border flex min-w-0 flex-wrap items-center justify-between gap-2 bg-(--bg-secondary)/70 p-2 sm:flex-nowrap">
			<div className="flex min-w-0 flex-1 flex-wrap items-center gap-2 sm:flex-nowrap">
				<div aria-label={languageLabel} className="w-full min-w-0 select-none sm:w-48 sm:shrink-0">
					<SelectExt
						className="h-8 rounded-lg text-sm"
						options={languageOptions}
						value={language}
						onChange={onLanguageChange}
					/>
				</div>
				<div className="flex shrink-0 items-center gap-1.5">
					<Button
						className="h-8 rounded-lg text-sm"
						disabled={disabled}
						leftIcon={<ArrowRightLeft className="size-4" />}
						onClick={onSwap}
					>
						{swapLabel}
					</Button>
					<Button
						className="h-8 rounded-lg text-sm"
						disabled={disabled}
						leftIcon={<Trash2 className="size-4" />}
						onClick={onClear}
					>
						{clearLabel}
					</Button>
				</div>
			</div>
			<div className="ml-auto flex shrink-0 items-center gap-1.5">
				<details ref={settingsRef} className="group relative">
					<summary className="flex h-8 cursor-pointer list-none items-center gap-1.5 rounded-lg bg-(--bg-secondary) px-2.5 text-sm hover:text-(--color-accent) focus-visible:outline focus-visible:outline-(--accent-primary-hover) [&::-webkit-details-marker]:hidden">
						<Settings2 className="size-4" />
						<span>{settingsLabel}</span>
						<ChevronDown className="size-3.5 transition-transform group-open:rotate-180" />
					</summary>
					<div className="core-border absolute top-full right-0 z-30 mt-2 flex w-[min(19rem,calc(100vw-2rem))] flex-col gap-3 bg-(--bg-secondary) p-3 shadow-(--shadow) backdrop-blur-md">
						{settings.map(({ label, checked, onChange, hint }) => (
							<label key={label} className="flex cursor-pointer items-center gap-2 text-sm" title={hint}>
								<input
									checked={checked}
									className="size-4 shrink-0 accent-(--color-accent)"
									type="checkbox"
									onChange={(event) => onChange(event.target.checked)}
								/>
								<span>{label}</span>
							</label>
						))}
					</div>
				</details>
				<Button
					centerIcon={<CircleHelp className="size-4" />}
					className="size-8 rounded-lg p-0"
					title="Как работает сравнение"
					onClick={onHelp}
				/>
			</div>
		</div>
	);
};
