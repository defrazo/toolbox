import type { UserStore } from '@/entities/user';
import type { AuthStore } from '@/features/auth';
import type { TabsStore } from '@/features/tabs';

export type SidebarServices = {
	tabsStore: TabsStore;
	userStore: UserStore;
	authStore: AuthStore;
};
