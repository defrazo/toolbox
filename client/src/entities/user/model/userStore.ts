import { makeAutoObservable } from 'mobx';

import { type AvatarId, AVATARS } from '@/shared/assets/images/avatars';

import type { User } from '.';

export class UserStore {
	user: User | null = null;

	get isAuth() {
		return !!this.user;
	}

	get username() {
		return this.user?.username;
	}

	get email() {
		return this.user?.email;
	}

	get avatarId(): AvatarId {
		return this.user?.avatar ?? 'avatar0';
	}

	get avatar() {
		return AVATARS[this.avatarId];
	}

	get pendingEmail() {
		return this.user?.pending_email ?? null;
	}

	get hasPendingEmail() {
		return !!this.user?.pending_email;
	}

	get isDemo() {
		return this.user?.is_demo ?? false;
	}

	setUser(user: User | null) {
		this.user = user;
	}

	clear() {
		this.user = null;
	}

	constructor() {
		makeAutoObservable(this);
	}
}
