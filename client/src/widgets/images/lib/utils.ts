export const formatFileSize = (bytes: number): string => {
	if (bytes === 0) return '0 B';

	const k = 1024;
	const sizes = ['B', 'KB', 'MB', 'GB'];
	const i = Math.floor(Math.log(bytes) / Math.log(k));

	return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

export const formatSizeChange = (before: number, after: number, locale: string) => {
	if (before <= 0) return '0%';

	const percent = ((after - before) / before) * 100;

	return `${percent.toLocaleString(locale, {
		minimumFractionDigits: 1,
		maximumFractionDigits: 1,
		signDisplay: 'always',
	})}%`;
};
