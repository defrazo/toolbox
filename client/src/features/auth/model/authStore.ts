import { makeAutoObservable, runInAction } from 'mobx';

import type { UserStore } from '@/entities/user';

import { authApi } from '../api';
import { authChannel } from '../lib';

export class AuthStore {
	private authVersion = 0;
	private initialized = false;

	isInitializing = true;
	isLoading = false;

	get isAuth(): boolean {
		return !!this.userStore.user;
	}

	async fetchUser(): Promise<void> {
		const version = this.authVersion;

		try {
			const { authenticated, user } = await authApi.getSession();

			if (version !== this.authVersion) return;

			runInAction(() => {
				if (authenticated && user) this.setSession(user);
				else this.clearSession();
			});
		} finally {
			runInAction(() => (this.isInitializing = false));
		}
	}

	async verifyInvite(inviteCode: string): Promise<string> {
		return authApi.verifyInvite(inviteCode.trim());
	}

	async verifyEmail(id: string, hash: string, params: Record<string, string>): Promise<boolean> {
		if (this.isLoading) return false;

		this.isLoading = true;

		try {
			const { user } = await authApi.verifyEmail(id, hash, params);
			this.setSession(user);
			return true;
		} finally {
			runInAction(() => (this.isLoading = false));
		}
	}

	async confirmOneMateLink(password: string): Promise<void> {
		if (this.isLoading) return;

		this.isLoading = true;

		try {
			await authApi.confirmOneMateLink(password);
			await this.fetchUser();

			if (!this.isAuth) throw new Error('Не удалось восстановить сессию после привязки');
		} finally {
			runInAction(() => (this.isLoading = false));
		}
	}

	async login(login: string, password: string): Promise<void> {
		this.isLoading = true;

		try {
			const { user } = await authApi.login(login.trim(), password);
			this.setSession(user);
		} finally {
			runInAction(() => (this.isLoading = false));
		}
	}

	async register(
		username: string,
		email: string,
		password: string,
		passwordConfirm: string,
		inviteToken: string,
		privacyAccepted: boolean
	): Promise<void> {
		this.isLoading = true;

		try {
			await authApi.register({
				username: username.trim(),
				email: email.trim().toLowerCase(),
				password,
				password_confirmation: passwordConfirm,
				invite_token: inviteToken,
				privacy_accepted: privacyAccepted,
			});
		} finally {
			runInAction(() => (this.isLoading = false));
		}
	}

	async resendVerificationEmail(email: string): Promise<void> {
		this.isLoading = true;

		try {
			await authApi.resendVerification(email);
		} finally {
			runInAction(() => (this.isLoading = false));
		}
	}

	async forgotPassword(email: string): Promise<void> {
		this.isLoading = true;

		try {
			await authApi.forgotPassword(email);
		} finally {
			runInAction(() => (this.isLoading = false));
		}
	}

	async resetPassword(email: string, token: string, password: string, passwordConfirm: string): Promise<void> {
		this.isLoading = true;

		try {
			await authApi.resetPassword({ email, token, password, password_confirmation: passwordConfirm });
		} finally {
			runInAction(() => (this.isLoading = false));
		}
	}

	async logout(): Promise<void> {
		this.authVersion++;

		try {
			await authApi.logout();
			authChannel.postMessage({ type: 'logout' });
		} finally {
			this.clearSession();
		}
	}

	private handleAuthMessage(event: MessageEvent): void {
		if (event.data?.type !== 'logout') return;
		this.clearSession();
	}

	private setSession(user: NonNullable<UserStore['user']>): void {
		this.authVersion++;
		this.userStore.setUser(user);
	}

	private clearSession(): void {
		this.authVersion++;
		this.userStore.clear();
	}

	constructor(private readonly userStore: UserStore) {
		makeAutoObservable<this, 'authVersion' | 'initialized'>(
			this,
			{ authVersion: false, initialized: false },
			{ autoBind: true }
		);
	}

	init(): void {
		if (this.initialized) return;
		this.initialized = true;

		authChannel.addEventListener('message', this.handleAuthMessage);

		void this.fetchUser().catch();
	}

	dispose(): void {
		authChannel.removeEventListener('message', this.handleAuthMessage);
		this.initialized = false;
	}
}
