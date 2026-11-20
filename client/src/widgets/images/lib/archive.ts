import JSZip from 'jszip';

export type ArchiveEntry = { name: string; blob: Blob };

export const buildArchive = async (entries: ArchiveEntry[], onProgress: (percent: number) => void) => {
	const zip = new JSZip();

	for (const entry of entries) zip.file(entry.name, entry.blob);

	let previous = -1;
	let lastUpdate = 0;

	return zip.generateAsync({ type: 'blob', compression: 'STORE' }, ({ percent }) => {
		const value = Math.floor(percent);
		const now = performance.now();

		if (value !== previous && (value === 100 || now - lastUpdate >= 50)) {
			lastUpdate = now;
			previous = value;
			onProgress(value);
		}
	});
};
