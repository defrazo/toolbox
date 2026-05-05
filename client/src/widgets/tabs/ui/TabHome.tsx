import { useNavigate } from 'react-router-dom';

import { useStore } from '@/app/providers';
import { Button } from '@/shared/ui';

export const TabHome = () => {
	const { userStore } = useStore();

	const navigate = useNavigate();

	return (
		<>
			<div className="relative flex flex-1 flex-col items-center justify-center gap-4 select-none">
				<h1 className="text-4xl font-semibold tracking-widest md:text-5xl md:tracking-[0.2em] xl:text-6xl">
					ToolBox
				</h1>
				<div className="h-1 w-32 animate-pulse rounded-full bg-linear-to-r from-(--accent-secondary-hover) to-(--accent-secondary)" />

				{!userStore.user && (
					<Button className="min-w-72" onClick={() => navigate('/login')}>
						Войти
					</Button>
				)}
				<h2 className="absolute bottom-0 rounded-2xl text-center text-xs text-(--color-secondary) opacity-50 transition-colors duration-500 ease-in-out select-none hover:text-(--color-accent) md:text-base">
					© {new Date().getFullYear()} Designed & Developed by Evgeniy Letunov
				</h2>
			</div>
		</>
	);
};
