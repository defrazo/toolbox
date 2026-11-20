import type { UserStore } from '@/entities/user';
import type { AuthStore } from '@/features/auth';
import type { TabsStore } from '@/features/tabs';

export interface SidebarStores {
	authStore: AuthStore;
	tabsStore: TabsStore;
	userStore: UserStore;
}
