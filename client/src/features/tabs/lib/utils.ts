import { saveAs } from 'file-saver';
import JSZip from 'jszip';

import type { ShortLink, ShortLinkDb } from '../model';

type ShareType = 'tg' | 'wa' | 'vk' | 'ok';

// === SHORTENER ===
export const share = (type: ShareType, url: string) => {
	const encodedUrl = encodeURIComponent(url);

	const links: Record<ShareType, string> = {
		tg: `https://t.me/share/url?url=${encodedUrl}`,
		wa: `https://api.whatsapp.com/send?text=${encodedUrl}`,
		vk: `https://vk.com/share.php?url=${encodedUrl}`,
		ok: `https://connect.ok.ru/offer?url=${encodedUrl}`,
	};

	window.open(links[type], '_blank', 'noopener,noreferrer');
};

export const getTtl = (createdAtIso: string, now: number) => {
	const createdMs = Date.parse(createdAtIso);
	if (Number.isNaN(createdMs)) return null;

	const diffMs = createdMs + 86400000 - now;
	if (diffMs <= 0) return null;

	const hours = Math.floor(diffMs / 3600000);
	const minutes = Math.floor((diffMs % 3600000) / 60000);

	return hours > 0 ? `${hours} ч ${minutes} м` : `${minutes} м`;
};

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

// === RENAMER ===
export const formatIndex = (idx: number) => String(idx + 1).padStart(2, '0');

export const buildName = (prefix: string, suffix: string, index: number, originalName: string) => {
	const ext = originalName.split('.').pop();
	return `${prefix}${formatIndex(index)}${suffix}.${ext}`;
};

export const buildRenamedFiles = (files: File[], prefix: string, suffix: string) => {
	return files.map(
		(file, index) => new File([file], buildName(prefix, suffix, index, file.name), { type: file.type })
	);
};

export const downloadAsZip = async (files: File[]) => {
	const zip = new JSZip();

	files.forEach((file) => zip.file(file.name, file));

	const content = await zip.generateAsync({ type: 'blob' });

	const now = new Date();
	const formatter = new Intl.DateTimeFormat('ru-RU', {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
		hour12: false,
	});

	const formattedDate = formatter
		.format(now)
		.replace(/(\d{2})\.(\d{2})\.(\d{4}),/, '$3-$2-$1')
		.replace(/:/g, '-')
		.replace(/, /, '_');

	saveAs(content, `Renamed_${formattedDate}.zip`);
};

export const formatFileSize = (bytes: number): string => {
	if (bytes === 0) return '0 B';

	const k = 1024;
	const sizes = ['B', 'KB', 'MB', 'GB'];
	const i = Math.floor(Math.log(bytes) / Math.log(k));

	return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};
