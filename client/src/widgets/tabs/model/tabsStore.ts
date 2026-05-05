import { makeAutoObservable, reaction } from 'mobx';

import type { TabId } from '.';

export class TabsStore {
	tab: TabId = 'home';

	setTab(id: TabId): void {
		this.tab = id;
	}

	constructor() {
		makeAutoObservable(this);

		const params = new URLSearchParams(window.location.search);
		const tabParam = params.get('tab') as TabId | null;
		if (tabParam) this.tab = tabParam;

		reaction(
			() => this.tab,
			(tab) => {
				const url = new URL(window.location.href);
				url.searchParams.set('tab', tab);
				window.history.replaceState({}, '', url);
			}
		);
	}
}
