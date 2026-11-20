import { type ArchiveEntry, buildArchive } from './archive';

self.onmessage = async ({ data }: MessageEvent<ArchiveEntry[]>) => {
	try {
		const blob = await buildArchive(data, (percent) => self.postMessage({ percent }));
		self.postMessage({ blob });
	} catch {
		self.postMessage({ error: true });
	}
};
