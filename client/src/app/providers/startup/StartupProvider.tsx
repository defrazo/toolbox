import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';

import App from '@/app';

import StoreProvider, { useStore } from '../store';

const AppInitializer = observer(() => {
	const { authStore, themeStore } = useStore();

	useEffect(() => {
		themeStore.setTheme(themeStore.theme);
		authStore.init();
	}, [authStore, themeStore]);

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
