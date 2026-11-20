import { useStore } from '@/app/providers';
import { DesktopSidebar, MobileSidebar } from '@/widgets/sidebar';

export const ToolboxSidebar = () => {
	const { authStore, tabsStore, userStore } = useStore();
	return <DesktopSidebar stores={{ authStore, tabsStore, userStore }} />;
};

export const ToolboxMobileSidebar = () => {
	const { authStore, tabsStore, userStore } = useStore();
	return <MobileSidebar stores={{ authStore, tabsStore, userStore }} />;
};
