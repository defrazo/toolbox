import { api } from '@/shared/api';

export const shortenUrl = async (url: string): Promise<string> => {
	const { data } = await api.post('/shorten', { url });
	return data.short_url;
};
