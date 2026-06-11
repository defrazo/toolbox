import { makeAutoObservable, reaction } from 'mobx';

export type TabId = (typeof VALID_TABS)[number];

const VALID_TABS = ['home', 'renamer', 'shortener', 'links', 'settings', 'help'] as const;

const isValidTab = (value: string): value is TabId => {
	return VALID_TABS.includes(value as TabId);
};

export class TabsStore {
	tab: TabId = 'home';

	setTab(id: TabId): void {
		this.tab = id;
	}

	private initFromUrl(): boolean {
		const params = new URLSearchParams(window.location.search);

		const tabParam = params.get('tab');

		const hasUnknownParams = [...params.keys()].some((key) => key !== 'tab');

		if (hasUnknownParams) {
			window.location.replace('/404');
			return false;
		}

		if (!params.has('tab')) return true;

		if (tabParam && isValidTab(tabParam)) {
			this.tab = tabParam;
			return true;
		}

		window.location.replace('/404');
		return false;
	}

	private syncUrl(): void {
		if (!this.isHomePage()) return;

		const url = new URL(window.location.href);
		url.searchParams.set('tab', this.tab);
		window.history.replaceState({}, '', url);
	}

	private isHomePage(): boolean {
		return window.location.pathname === '/';
	}

	constructor() {
		makeAutoObservable(this);

		if (!this.isHomePage()) return;

		if (!this.initFromUrl()) return;

		this.syncUrl();

		reaction(
			() => this.tab,
			() => this.syncUrl()
		);
	}
}
