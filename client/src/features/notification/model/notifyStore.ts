import { makeAutoObservable } from 'mobx';

import { type Notification, notify, type NotifyType } from '.';

export class NotifyStore {
	private debounce: ReturnType<typeof setTimeout> | null = null;

	notification: Notification | null = null;

	setNotice(message: string, type: NotifyType): void {
		this.clearDebounce();

		notify[type](message);

		this.notification = { message, type };
		this.debounce = setTimeout(() => this.clearNotice(), 3000);
	}

	private clearNotice(): void {
		this.notification = null;
	}

	constructor() {
		makeAutoObservable<this, 'debounce'>(this, {
			debounce: false,
		});
	}

	destroy(): void {
		this.clearDebounce();
	}

	private clearDebounce(): void {
		if (this.debounce) {
			clearTimeout(this.debounce);
			this.debounce = null;
		}
	}
}
