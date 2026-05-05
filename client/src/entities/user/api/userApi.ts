import { api } from '@/shared/lib/api';

export const getUser = async () => {
	return api.get('/api/user');
};

export const updateProfile = async (data: { username?: string; avatar?: string }) => {
	return api.patch('/api/user', data);
};
