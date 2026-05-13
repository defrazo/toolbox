import { makeAutoObservable } from 'mobx';

import { DEFAULT_AVATAR, type User } from '.';

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

	get avatar() {
		return this.user?.avatar ?? DEFAULT_AVATAR;
	}

	get role() {
		return this.user?.role ?? 'user';
	}

	setUser(user: User | null) {
		this.user = user;
	}

	updateUsername(username: string) {
		if (!this.user) return;
		this.user = { ...this.user, username };
	}

	updateEmail(email: string) {
		if (!this.user) return;
		this.user = { ...this.user, email };
	}

	updateAvatar(avatar: string) {
		if (!this.user) return;
		this.user = { ...this.user, avatar };
	}

	clear() {
		this.user = null;
	}

	constructor() {
		makeAutoObservable(this);
	}
}
