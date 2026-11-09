import { makeAutoObservable, reaction } from 'mobx';

export type TabId = (typeof VALID_TABS)[number];

export type ShortcutAction = { type: 'paste-url'; text: string } | { type: 'upload-files' | 'background' | 'crop' };

const VALID_TABS = ['home', 'images', 'compare', 'renamer', 'shortener', 'links', 'settings'] as const;

const isValidTab = (value: string): value is TabId => {
	return VALID_TABS.includes(value as TabId);
};

export class TabsStore {
	private shortcutSequence = 0;

	tab: TabId = 'home';
	shortcut: (ShortcutAction & { id: number }) | null = null;

	setTab(id: TabId): void {
		this.shortcut = null;
		this.tab = id;
	}

	openShortcut(action: ShortcutAction): void {
		this.tab = action.type === 'paste-url' ? 'shortener' : action.type === 'upload-files' ? 'renamer' : 'images';
		this.shortcut = { ...action, id: ++this.shortcutSequence };
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
