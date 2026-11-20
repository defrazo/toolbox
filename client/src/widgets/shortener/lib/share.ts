type ShareType = 'tg' | 'wa' | 'vk' | 'ok';

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
