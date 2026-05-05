import { Moon, Sun } from 'lucide-react';
import { observer } from 'mobx-react-lite';

import { useStore } from '@/app/providers';
import { cn } from '@/shared/lib/utils';

const ThemeSwitcher = ({ className }: { className?: string }) => {
	const { themeStore } = useStore();

	const isDark = themeStore.theme === 'dark';
	const handleToogle = () => themeStore.toggleTheme();

	return (
		<div
			className={cn(
				'group relative flex size-10 cursor-pointer items-center rounded-full bg-(--bg-tertiary) p-0.5 transition-all duration-500 hover:w-20',
				className
			)}
			onClick={handleToogle}
		>
			<Moon
				className={cn(
					'absolute left-2.5 transition-all duration-500 group-hover:scale-110 group-hover:opacity-100',
					isDark ? 'z-10 text-(--accent-primary)' : 'text-(--accent-primary-op) opacity-0'
				)}
				size={20}
			/>
			<Sun
				className={cn(
					'absolute right-2.5 transition-all duration-500 group-hover:scale-110 group-hover:opacity-100',
					!isDark ? 'z-10 text-(--accent-secondary)' : 'text-(--accent-secondary-op) opacity-0'
				)}
				size={20}
			/>
			<div
				className={cn(
					'size-9 transform rounded-full border border-solid border-transparent bg-(--bg-secondary) shadow-md transition-all duration-500 group-hover:border-(--accent-primary-hover)',
					isDark
						? 'translate-x-0 translate-y-0 group-hover:translate-x-0'
						: 'translate-x-0 translate-y-0 group-hover:translate-x-10'
				)}
			/>
		</div>
	);
};

export default observer(ThemeSwitcher);
