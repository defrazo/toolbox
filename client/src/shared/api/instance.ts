import axios from 'axios';

import { TOKEN_KEY } from '../config';

export const api = axios.create({
	baseURL: '/api',
	timeout: 30000,
	headers: { Accept: 'application/json' },
});

api.interceptors.request.use((config) => {
	const token = localStorage.getItem(TOKEN_KEY);

	if (token) config.headers.Authorization = `Bearer ${token}`;

	return config;
});
