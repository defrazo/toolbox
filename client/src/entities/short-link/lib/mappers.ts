import type { ShortLink, ShortLinkDb } from '../model/types';

export const mapLinkFromDb = (data: ShortLinkDb): ShortLink => ({
	id: data.id,
	code: data.code,
	shortUrl: data.short_url,
	originalUrl: data.original_url,
	clicks: data.clicks,
	createdAt: data.created_at,
	locked: data.locked,
});

export const mapLinksFromDb = (data: ShortLinkDb[]): ShortLink[] => data.map(mapLinkFromDb);
