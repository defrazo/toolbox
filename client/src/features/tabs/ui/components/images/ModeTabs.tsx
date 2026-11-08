import { useLayoutEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { useStore } from '@/app/providers';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui';

import type { Mode } from '../../../model';

interface ModeTabsProps {
	mode: Mode;
	hasWork?: boolean;
	onModeChange: (mode: Mode) => void;
}

const MODES: readonly Mode[] = ['converter', 'compression', 'resize', 'vectorize', 'crop'];

export const ModeTabs = ({ mode, hasWork = false, onModeChange }: ModeTabsProps) => {
	const { t } = useTranslation('images');

	const { modalStore } = useStore();

	const tabsRef = useRef<HTMLDivElement>(null);

	const handleModeChange = (next: Mode) => {
		if (next === mode) return;

		if (!hasWork) {
			onModeChange(next);
			return;
		}

		modalStore.setModal(
			<div className="flex flex-col gap-4 select-none">
				<span>{t(($) => $.switchMode.question)}</span>
				<div className="flex gap-3">
					<Button
						className="flex-1"
						onClick={() => {
							modalStore.closeModal();
							onModeChange(next);
						}}
					>
						{t(($) => $.switchMode.confirm)}
					</Button>
					<Button className="flex-1" onClick={() => modalStore.closeModal()}>
						{t(($) => $.switchMode.cancel)}
					</Button>
				</div>
			</div>,
			'confirm'
		);
	};

	useLayoutEffect(() => {
		const tabs = tabsRef.current;
		if (!tabs) return;

		const revealActive = () => {
			if (window.matchMedia('(max-width: 1279px)').matches) return;

			const active = tabs.querySelector<HTMLElement>('[aria-pressed="true"]');
			if (!active) return;

			const viewport = tabs.getBoundingClientRect();
			const button = active.getBoundingClientRect();

			if (button.left < viewport.left) tabs.scrollLeft += button.left - viewport.left;
			else if (button.right > viewport.right) tabs.scrollLeft += button.right - viewport.right;
		};

		revealActive();

		const observer = new ResizeObserver(revealActive);
		observer.observe(tabs);

		return () => observer.disconnect();
	}, [mode]);

	return (
		<div
			ref={tabsRef}
			aria-label={t(($) => $.mode)}
			className="core-border core-scrollbar grid w-full min-w-0 shrink-0 grid-cols-2 bg-(--bg-tertiary)/70 p-1 shadow-(--shadow) not-xl:gap-1 xl:flex xl:h-12 xl:overflow-x-auto"
			role="group"
		>
			{MODES.map((value) => (
				<Button
					key={value}
					aria-pressed={mode === value}
					className={cn(
						'min-w-0 rounded-lg px-3 py-2.5 text-base whitespace-nowrap transition-all duration-500 ease-out hover:-translate-y-px hover:border-(--accent-primary-hover) xl:flex-1 xl:py-2 xl:not-first:rounded-l-none xl:not-last:rounded-r-none',
						mode === value && 'active-btn',
						value === 'crop' && 'col-span-2'
					)}
					onClick={() => handleModeChange(value)}
				>
					<span className="trim">{t(($) => $[value].title)}</span>
				</Button>
			))}
		</div>
	);
};
