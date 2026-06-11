import { api } from '@/shared/api';

import { mapLinkFromDb, mapLinksFromDb } from '../lib';
import type { ApiResponse, ShortLink, ShortLinkDb } from '../model';

export const linksApi = {
	getLinks: async (): Promise<ShortLink[]> => {
		const { data } = await api.get<ApiResponse<ShortLinkDb[]>>('/links');

		return mapLinksFromDb(data.data);
	},

	createLink: async (url: string): Promise<ShortLink> => {
		const { data } = await api.post<ApiResponse<ShortLinkDb>>('/shorten', { url });

		return mapLinkFromDb(data.data);
	},

	updateLink: async (id: number, payload: { locked: boolean }): Promise<ShortLink> => {
		const { data } = await api.patch<ApiResponse<ShortLinkDb>>(`/links/${id}`, payload);

		return mapLinkFromDb(data.data);
	},

	deleteLink: async (id: number): Promise<void> => {
		await api.delete(`/links/${id}`);
	},
};
