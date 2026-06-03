import { api } from '@/shared/api';
import type { AvatarId } from '@/shared/assets/images/avatars';

type UpdateProfileDto = {
	username?: string;
	avatar?: AvatarId;
};

type UpdatePasswordDto = {
	current_password: string;
	password: string;
	password_confirmation: string;
};

export const getUser = async () => {
	return api.get('/user');
};

export const updateProfile = async (data: UpdateProfileDto) => {
	return api.patch('/user', data);
};

export const updateEmail = async (email: string) => {
	return api.patch('/user/email', { email });
};

export const resendPendingEmail = async () => {
	return api.post('/user/email/resend');
};

export const updatePassword = async (data: UpdatePasswordDto) => {
	return api.patch('/user/password', data);
};
