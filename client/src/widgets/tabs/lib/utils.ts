import { saveAs } from 'file-saver';
import JSZip from 'jszip';

import type { ShareType } from '../model';

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

// === RENAMER ===
export const formatIndex = (idx: number) => String(idx + 1).padStart(2, '0');

export const buildName = (prefix: string, suffix: string, index: number, originalName: string) => {
	const ext = originalName.split('.').pop();
	return `${prefix}${formatIndex(index)}${suffix}.${ext}`;
};

export const plural = (count: number, one: string, few: string, many: string) => {
	const mod10 = count % 10;
	const mod100 = count % 100;

	if (mod100 >= 11 && mod100 <= 14) return many;
	if (mod10 === 1) return one;
	if (mod10 >= 2 && mod10 <= 4) return few;

	return many;
};

export const downloadAsZip = async (files: File[]) => {
	const zip = new JSZip();

	files.forEach((file) => {
		zip.file(file.name, file);
	});

	const content = await zip.generateAsync({ type: 'blob' });

	saveAs(content, 'renamed-files.zip');
};
