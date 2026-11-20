import { makeAutoObservable, reaction } from 'mobx';

export type TabId = string;

export type TabRequest = { type: string; payload?: unknown };

type TabsConfig = {
	tabs: readonly TabId[];
	defaultTab: TabId;
};

export class TabsStore {
	private shortcutSequence = 0;

	tab: TabId;
	shortcut: (TabRequest & { id: number; target: TabId }) | null = null;

	setTab(id: TabId): void {
		this.shortcut = null;
		this.tab = id;
	}

	openShortcut(target: TabId, request: TabRequest): void {
		this.tab = target;
		this.shortcut = { ...request, target, id: ++this.shortcutSequence };
	}

	consumeShortcut(id: number): boolean {
		if (this.shortcut?.id !== id) return false;
		this.shortcut = null;
		return true;
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

		if (tabParam && this.config.tabs.includes(tabParam)) {
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

	constructor(private readonly config: TabsConfig) {
		this.tab = config.defaultTab;
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
