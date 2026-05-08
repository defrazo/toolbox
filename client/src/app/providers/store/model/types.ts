import type { UserStore } from '@/entities/user';
import type { AuthStore } from '@/features/auth';
import type { TabsStore } from '@/features/tabs';
import type { ThemeStore } from '@/features/theme-switcher';
import type { ModalStore, NotifyStore } from '@/shared/stores';

export interface CoreStores {
	readonly userStore: UserStore;
	readonly authStore: AuthStore;
	readonly notifyStore: NotifyStore;
	readonly modalStore: ModalStore;
	readonly themeStore: ThemeStore;
	readonly tabsStore: TabsStore;
}
