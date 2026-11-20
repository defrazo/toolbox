import { useStore } from '@/app/providers';
import { Settings } from '@/widgets/settings';

export const SettingsScreen = () => {
	const { notifyStore, themeStore, userStore } = useStore();
	return <Settings stores={{ notifyStore, themeStore, userStore }} />;
};
