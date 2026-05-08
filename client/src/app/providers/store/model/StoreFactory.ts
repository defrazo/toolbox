import { UserStore } from '@/entities/user';
import { AuthStore } from '@/features/auth';
import { TabsStore } from '@/features/tabs';
import { ThemeStore } from '@/features/theme-switcher';
import { ModalStore, NotifyStore } from '@/shared/stores';

import { CoreStores } from '.';

export class StoreFactory {
	static createCore(): CoreStores {
		const userStore = new UserStore();
		const authStore = new AuthStore(userStore);
		const notifyStore = new NotifyStore();
		const modalStore = new ModalStore();
		const tabsStore = new TabsStore();
		const themeStore = new ThemeStore();

		return { userStore, authStore, notifyStore, modalStore, tabsStore, themeStore };
	}
}
