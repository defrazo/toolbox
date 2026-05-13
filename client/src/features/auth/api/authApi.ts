import { api } from '@/shared/api';

export const login = async (email: string, password: string) => {
	await api.get('/sanctum/csrf-cookie');
	return api.post('/login', { email, password });
};

export const logout = async () => {
	return api.post('/logout');
};
