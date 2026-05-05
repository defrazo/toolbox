import { makeAutoObservable, runInAction } from 'mobx';

import { getUser, UserStore } from '@/entities/user';

import { login, logout } from '../api/authApi';

export class AuthStore {
	isLoading = true;

	get isAuth() {
		return !!this.userStore.user;
	}

	constructor(private userStore: UserStore) {
		makeAutoObservable(this);
	}

	async init() {
		await this.fetchUser();
	}

	async fetchUser() {
		try {
			const { data } = await getUser();
			this.userStore.setUser(data);
		} catch {
			this.userStore.clear();
		} finally {
			runInAction(() => {
				this.isLoading = false;
			});
		}
	}

	async login(email: string, password: string) {
		await login(email, password);
		await this.fetchUser();
	}

	async logout() {
		await logout();
		this.userStore.clear();
	}
}
