import { UserStore } from '@/entities/user/model/userStore';
import { AuthStore } from '@/features/auth/model/authStore';
import { ModalStore } from '@/features/modal/model/modalStore';
import { NotifyStore } from '@/features/notification/model/notifyStore';
import { TabsStore } from '@/features/tabs/model/tabsStore';
import { ThemeStore } from '@/features/theme-switcher/model/themeStore';

import type { CoreStores } from './types';

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
