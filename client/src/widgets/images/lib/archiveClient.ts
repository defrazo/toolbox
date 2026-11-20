import { type ArchiveEntry, buildArchive } from './archive';

export const createArchive = async (
	entries: ArchiveEntry[],
	signal: AbortSignal,
	onProgress: (percent: number) => void
): Promise<Blob> => {
	signal.throwIfAborted();
	const onMainThread = async () => {
		const blob = await buildArchive(entries, (percent) => {
			if (!signal.aborted) onProgress(percent);
		});
		signal.throwIfAborted();
		return blob;
	};

	if (entries.reduce((bytes, entry) => bytes + entry.blob.size, 0) < 16 * 1024 * 1024) return onMainThread();

	let worker: Worker;

	try {
		worker = new Worker(new URL('./archive.worker.ts', import.meta.url), { type: 'module' });
	} catch {
		return onMainThread();
	}

	return new Promise((resolve, reject) => {
		const cleanup = () => {
			signal.removeEventListener('abort', abort);
			worker.terminate();
		};

		const abort = () => {
			cleanup();
			reject(signal.reason);
		};

		signal.addEventListener('abort', abort, { once: true });

		worker.onmessage = ({ data }: MessageEvent<{ blob?: Blob; percent?: number; error?: boolean }>) => {
			if (signal.aborted) return;

			if (data.blob || data.error) {
				cleanup();
				if (data.blob) resolve(data.blob);
				else reject(new Error('download'));
			} else if (data.percent !== undefined) onProgress(data.percent);
		};

		const fail = () => {
			cleanup();
			reject(new Error('download'));
		};

		worker.onerror = (event) => {
			event.preventDefault();
			fail();
		};

		worker.onmessageerror = fail;

		try {
			worker.postMessage(entries);
		} catch {
			fail();
		}
	});
};
