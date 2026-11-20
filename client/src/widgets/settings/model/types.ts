import type { UserStore } from '@/entities/user';
import type { NotifyStore } from '@/features/notification';
import type { ThemeStore } from '@/features/theme-switcher';

export interface SettingsStores {
	notifyStore: NotifyStore;
	themeStore: ThemeStore;
	userStore: UserStore;
}
