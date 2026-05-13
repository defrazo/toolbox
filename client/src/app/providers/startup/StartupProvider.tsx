import { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';

import App from '@/app';
import { PreloaderExt } from '@/shared/ui';

import StoreProvider, { useStore } from '../store';

const AppInitializer = observer(() => {
	const { themeStore, authStore } = useStore();

	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		const init = async () => {
			themeStore.setTheme(themeStore.theme);
			await authStore.init();
			setIsLoading(false);
		};

		void init();
	}, []);

	if (isLoading) return <PreloaderExt />;

	return (
		<div className="relative flex h-dvh w-full flex-col">
			<div className="flex min-h-0 flex-1 flex-col transition-opacity duration-100">
				<App />
			</div>
		</div>
	);
});

const StartupProvider = () => {
	return (
		<StoreProvider>
			<AppInitializer />
		</StoreProvider>
	);
};

export default StartupProvider;
