import { api, csrf } from '@/shared/api';

import type { AuthResponse, AuthSessionResponse, RegisterPayload, ResetPasswordPayload } from '.';

export const authApi = {
	async verifyInvite(inviteCode: string): Promise<string> {
		await csrf();

		const { data } = await api.post<{ invite_token: string }>('/invite/verify', { invite_code: inviteCode.trim() });
		return data.invite_token;
	},

	async verifyEmail(id: string, hash: string, params: Record<string, string>): Promise<AuthResponse> {
		await csrf();

		const { data } = await api.get<AuthResponse>(`/email/verify/${id}/${hash}`, { params });
		return data;
	},

	async register(payload: RegisterPayload): Promise<void> {
		await csrf();
		await api.post('/register', payload);
	},

	async login(login: string, password: string): Promise<AuthResponse> {
		await csrf();

		const { data } = await api.post<AuthResponse>('/login', { login: login.trim().toLowerCase(), password });
		return data;
	},

	async confirmOneMateLink(password: string): Promise<void> {
		await csrf();
		await api.post('/auth/onemate/link/confirm', { password });
	},

	async getSession(): Promise<AuthSessionResponse> {
		const { data } = await api.get<AuthSessionResponse>('/auth/session');
		return data;
	},

	async logout(): Promise<void> {
		await csrf();
		await api.post('/logout');
	},

	async resendVerification(email: string): Promise<void> {
		await csrf();
		await api.post('/email/resend', { email: email.trim().toLowerCase() });
	},

	async forgotPassword(email: string): Promise<void> {
		await csrf();
		await api.post('/forgot-password', { email: email.trim().toLowerCase() });
	},

	async resetPassword(payload: ResetPasswordPayload): Promise<void> {
		await csrf();
		await api.post('/reset-password', { ...payload, email: payload.email.trim().toLowerCase() });
	},
};
