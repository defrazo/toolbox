import { TOOLBOX_TABS } from '@/app/toolbox/config';
import { UserStore } from '@/entities/user';
import { AuthStore } from '@/features/auth/model/authStore';
import { ModalStore } from '@/features/modal/model/modalStore';
import { NotifyStore } from '@/features/notification';
import { TabsStore } from '@/features/tabs';
import { ThemeStore } from '@/features/theme-switcher';

import type { CoreStores } from './types';

export class StoreFactory {
	static createCore(): CoreStores {
		const userStore = new UserStore();
		const authStore = new AuthStore(userStore);
		const modalStore = new ModalStore();
		const notifyStore = new NotifyStore();
		const tabsStore = new TabsStore(TOOLBOX_TABS);
		const themeStore = new ThemeStore();

		return { userStore, authStore, modalStore, notifyStore, tabsStore, themeStore };
	}
}
