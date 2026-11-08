import { StoreFactory } from './StoreFactory';
import type { CoreStores } from './types';

export class RootStore implements CoreStores {
	public readonly themeStore: CoreStores['themeStore'];
	public readonly userStore: CoreStores['userStore'];
	public readonly authStore: CoreStores['authStore'];
	public readonly notifyStore: CoreStores['notifyStore'];
	public readonly modalStore: CoreStores['modalStore'];
	public readonly tabsStore: CoreStores['tabsStore'];

	constructor() {
		const coreStores = StoreFactory.createCore();

		this.themeStore = coreStores.themeStore;
		this.userStore = coreStores.userStore;
		this.authStore = coreStores.authStore;
		this.notifyStore = coreStores.notifyStore;
		this.modalStore = coreStores.modalStore;
		this.tabsStore = coreStores.tabsStore;
	}
}

let rootStore: RootStore | undefined = import.meta.hot?.data.rootStore;

export const getRootStore = (): RootStore => {
	return (rootStore ??= new RootStore());
};

export const resetRootStore = (): void => {
	if (process.env.NODE_ENV !== 'production') return;
};

if (import.meta.hot) {
	import.meta.hot.accept();

	import.meta.hot.dispose((data) => {
		data.rootStore = rootStore;
	});
}
