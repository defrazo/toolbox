import { UserStore } from '@/entities/user';
import { AuthStore } from '@/features/auth';
import { ModalStore } from '@/features/modal';
import { NotifyStore } from '@/features/notification';
import { TabsStore } from '@/features/tabs';
import { ThemeStore } from '@/features/theme-switcher';

import { CoreStores } from '.';

export class StoreFactory {
	static createCore(): CoreStores {
		const userStore = new UserStore();
		const authStore = new AuthStore(userStore);
		const modalStore = new ModalStore();
		const notifyStore = new NotifyStore();
		const tabsStore = new TabsStore();
		const themeStore = new ThemeStore();

		return { userStore, authStore, modalStore, notifyStore, tabsStore, themeStore };
	}
}
