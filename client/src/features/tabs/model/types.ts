import type { TabId } from '.';

export type Tab = { id: TabId; title: string };

export type ShortLink = {
	id: number;
	code: string;
	shortUrl: string;
	originalUrl: string;
	clicks: number;
	createdAt: string;
	locked: boolean;
};

export type ShortLinkDb = {
	id: number;
	code: string;
	short_url: string;
	original_url: string;
	clicks: number;
	created_at: string;
	locked: boolean;
};

export type ApiResponse<T> = {
	data: T;
	code?: string;
};
