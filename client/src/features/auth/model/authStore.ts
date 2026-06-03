import { makeAutoObservable, runInAction } from 'mobx';

import type { User } from '@/entities/user';
import { getUser, UserStore } from '@/entities/user';
import { TOKEN_KEY } from '@/shared/config';

import { forgotPassword, login, logout, register, resendEmail, resetPassword } from '../api';

export class AuthStore {
	isInitializing = true;
	isLoading = false;

	get isAuth() {
		return !!this.userStore.user;
	}

	setSession(user: User, token: string) {
		localStorage.setItem(TOKEN_KEY, token);
		this.userStore.setUser(user);
	}

	async fetchUser() {
		if (!localStorage.getItem(TOKEN_KEY)) {
			this.userStore.clear();
			runInAction(() => (this.isInitializing = false));
			return;
		}

		try {
			const { data } = await getUser();
			this.userStore.setUser(data);
		} catch {
			this.userStore.clear();
		} finally {
			runInAction(() => (this.isInitializing = false));
		}
	}

	async login(email: string, password: string) {
		runInAction(() => (this.isLoading = true));

		try {
			const { data } = await login(email, password);
			this.setSession(data.user, data.token);
		} catch (error) {
			throw error;
		} finally {
			runInAction(() => (this.isLoading = false));
		}
	}

	async register(
		username: string,
		email: string,
		password: string,
		passwordConfirmation: string,
		invite_token: string,
		isPrivacyAccepted: boolean
	) {
		runInAction(() => (this.isLoading = true));

		try {
			await register({
				username,
				email,
				password,
				password_confirmation: passwordConfirmation,
				invite_token,
				privacy_accepted: isPrivacyAccepted,
			});
		} catch (error) {
			throw error;
		} finally {
			runInAction(() => (this.isLoading = false));
		}
	}

	async logout() {
		try {
			await logout();
		} finally {
			localStorage.removeItem(TOKEN_KEY);
			this.userStore.clear();
		}
	}

	async resendVerificationEmail(email: string) {
		runInAction(() => (this.isLoading = true));

		try {
			await resendEmail(email);
		} finally {
			runInAction(() => (this.isLoading = false));
		}
	}

	async forgotPassword(email: string) {
		runInAction(() => (this.isLoading = true));

		try {
			await forgotPassword(email);
		} finally {
			runInAction(() => (this.isLoading = false));
		}
	}

	async resetPassword(email: string, token: string, password: string, passwordConfirmation: string) {
		runInAction(() => (this.isLoading = true));

		try {
			await resetPassword({
				email,
				token,
				password,
				password_confirmation: passwordConfirmation,
			});
		} catch (error) {
			throw error;
		} finally {
			runInAction(() => (this.isLoading = false));
		}
	}

	constructor(private userStore: UserStore) {
		makeAutoObservable(this);
	}

	async init() {
		await this.fetchUser();
	}
}
