import { api } from '@/shared/api';

type RegisterDto = {
	username: string;
	email: string;
	password: string;
	password_confirmation: string;
	invite_token: string;
	privacy_accepted: boolean;
};

type ResetPasswordDto = {
	email: string;
	token: string;
	password: string;
	password_confirmation: string;
};

export const register = (data: RegisterDto) => {
	return api.post('/register', data);
};

export const login = (email: string, password: string) => {
	return api.post('/login', { email, password });
};

export const logout = () => {
	return api.post('/logout');
};

export const verifyInvite = async (inviteCode: string) => {
	return api.post('/invite/verify', { invite_code: inviteCode });
};

export const resendEmail = (email: string) => {
	return api.post('/email/resend', { email });
};

export const forgotPassword = (email: string) => {
	return api.post('/forgot-password', { email });
};

export const resetPassword = (data: ResetPasswordDto) => {
	return api.post('/reset-password', data);
};
