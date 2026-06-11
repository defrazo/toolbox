import { api } from '@/shared/api';

import { mapLinkFromDb } from '../lib';
import type { ApiResponse, ShortLink, ShortLinkDb } from '../model';

export const shortenApi = async (url: string): Promise<ShortLink> => {
	const { data } = await api.post<ApiResponse<ShortLinkDb>>('/shorten', { url });

	return mapLinkFromDb(data.data);
};
