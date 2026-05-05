import { CoreStores, StoreFactory } from '.';

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

let rootStore: RootStore;

export const getRootStore = (): RootStore => {
	if (!rootStore) rootStore = new RootStore();

	if (import.meta.hot) {
		import.meta.hot.data.rootStore = rootStore;
		import.meta.hot.accept();
	}

	return rootStore;
};

export const resetRootStore = (): void => {
	if (process.env.NODE_ENV !== 'production') return;
};
