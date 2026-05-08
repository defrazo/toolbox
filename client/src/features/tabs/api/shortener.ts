export const shortenUrl = async (url: string) => {
	const res = await fetch('/api/shorten', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ url }),
	});

	const data = await res.json();

	return data.short_url;
};
