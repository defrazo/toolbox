import type { UserStore } from '@/entities/user';
import type { AuthStore } from '@/features/auth';
import type { ModalStore } from '@/features/modal';
import type { NotifyStore } from '@/features/notification';
import type { TabsStore } from '@/features/tabs';
import type { ThemeStore } from '@/features/theme-switcher';

export interface CoreStores {
	readonly userStore: UserStore;
	readonly authStore: AuthStore;
	readonly modalStore: ModalStore;
	readonly notifyStore: NotifyStore;
	readonly tabsStore: TabsStore;
	readonly themeStore: ThemeStore;
}
