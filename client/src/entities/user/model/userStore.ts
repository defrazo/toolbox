import { makeAutoObservable } from 'mobx';

import { DEFAULT_AVATAR } from '@/shared/lib/constants';

import type { User } from '.';

export class UserStore {
	user: User | null = null;

	constructor() {
		makeAutoObservable(this);
	}

	setUser(user: User | null) {
		this.user = user;
	}

	updateAvatar(avatar: string) {
		if (!this.user) return;

		this.user = { ...this.user, avatar };
	}

	updateUsername(username: string) {
		if (!this.user) return;

		this.user = { ...this.user, username };
	}

	updateEmail(email: string) {
		if (!this.user) return;

		this.user = { ...this.user, email };
	}

	clear() {
		this.user = null;
	}

	get isAuth() {
		return !!this.user;
	}

	get username() {
		return this.user?.username ?? 'Пользователь';
	}

	get email() {
		return this.user?.email ?? 'Пользователь';
	}

	get avatar() {
		return this.user?.avatar ?? DEFAULT_AVATAR;
	}

	get role() {
		return this.user?.role ?? 'user';
	}
}
