import type { BackgroundRequest, ImageWorkerRequest } from '../../model/types';
import { checkDimensions, createCanvas, loadImage } from './converter';
import { type ImageJob, type ImageJobResult, processImage } from './processImage';
import type { ProcessingResponse } from './processing.worker';

const prepareJpegResize = async (job: Extract<ImageJob, { mode: 'resize' }>, signal: AbortSignal) => {
	if (job.plan.error) throw new Error(job.plan.error);
	if (typeof createImageBitmap !== 'function') throw new Error('workerUnsupported');

	const { width, height } = job.plan;

	checkDimensions(width, height);

	const image = await loadImage(job.file, signal);

	let surface: ReturnType<typeof createCanvas> | undefined;

	try {
		surface = createCanvas(width, height);
		const { canvas, context } = surface;

		signal.throwIfAborted();

		context.drawImage(image, 0, 0, width, height);

		let bitmap: ImageBitmap;

		try {
			bitmap = await createImageBitmap(canvas);
		} catch {
			signal.throwIfAborted();
			throw new Error('workerUnsupported');
		}
		if (signal.aborted) {
			bitmap.close();
			signal.throwIfAborted();
		}
		return bitmap;
	} finally {
		image.src = '';
		if (surface) surface.canvas.width = surface.canvas.height = 0;
	}
};

export const estimateImageJobBytes = (job: ImageJob, width: number, height: number) => {
	const source = width * height;
	const output = job.mode === 'resize' && !job.plan.error ? job.plan.width * job.plan.height : source;

	const avif = job.mode === 'converter' ? job.output === 'avif' : job.mode !== 'background' && job.format === 'avif';
	const pngOptimizer = job.mode === 'compression' && job.format === 'png';
	const bytesPerPixel =
		job.mode === 'background' ? 32 : avif ? 48 : pngOptimizer ? 32 : job.format === 'ico' ? 24 : 16;

	return Math.max(source, output) * bytesPerPixel + (pngOptimizer ? 64 : 32) * 1024 * 1024;
};

const codecRequest = (data: ImageWorkerRequest | BackgroundRequest, signal: AbortSignal): Promise<ArrayBuffer> =>
	new Promise((resolve, reject) => {
		signal.throwIfAborted();

		const worker =
			data.format === 'background'
				? new Worker(new URL('./background.worker.ts', import.meta.url), { type: 'module' })
				: new Worker(new URL('./image.worker.ts', import.meta.url), { type: 'module' });

		const cleanup = () => {
			signal.removeEventListener('abort', abort);
			worker.terminate();
		};

		const abort = () => {
			cleanup();
			reject(signal.reason);
		};

		signal.addEventListener('abort', abort, { once: true });

		worker.onmessage = ({ data: result }: MessageEvent<{ buffer?: ArrayBuffer; error?: string }>) => {
			cleanup();
			if (result.buffer) resolve(result.buffer);
			else reject(new Error(result.error ?? 'encode'));
		};

		worker.onerror = (event) => {
			event.preventDefault();
			cleanup();
			reject(new Error('encode'));
		};

		worker.onmessageerror = () => {
			cleanup();
			reject(new Error('encode'));
		};

		try {
			worker.postMessage(data, [data.format === 'png' ? data.buffer : data.image.data.buffer]);
		} catch (error) {
			cleanup();
			reject(error);
		}
	});

export const createImageProcessor = (signal: AbortSignal) => {
	let worker: Worker | null = null;
	let fallback = false;
	let rejectPending: ((reason: unknown) => void) | undefined;

	const dispose = () => {
		worker?.terminate();
		worker = null;

		rejectPending?.(signal.reason ?? new Error('encode'));
		rejectPending = undefined;
	};

	signal.addEventListener('abort', dispose, { once: true });

	return {
		async process(job: ImageJob): Promise<ImageJobResult> {
			signal.throwIfAborted();

			if (!fallback) {
				let bitmap: ImageBitmap | undefined;

				try {
					if (job.mode === 'resize' && job.format === 'jpg') bitmap = await prepareJpegResize(job, signal);

					signal.throwIfAborted();

					return await new Promise<ImageJobResult>((resolve, reject) => {
						try {
							worker ??= new Worker(new URL('./processing.worker.ts', import.meta.url), {
								type: 'module',
							});
						} catch {
							reject(new Error('workerUnsupported'));
							return;
						}

						const activeWorker = worker;

						rejectPending = reject;

						activeWorker.onmessage = ({ data }: MessageEvent<ProcessingResponse>) => {
							if (worker !== activeWorker || data.id !== job.id) return;

							rejectPending = undefined;

							if ('result' in data) resolve(data.result);
							else reject(new Error(data.error));
						};
						const fail = () => {
							if (worker !== activeWorker) return;

							const rejectCurrent = rejectPending;

							rejectPending = undefined;
							dispose();
							rejectCurrent?.(new Error('workerUnsupported'));
						};

						activeWorker.onerror = (event) => {
							event.preventDefault();
							fail();
						};

						activeWorker.onmessageerror = fail;

						try {
							activeWorker.postMessage(bitmap ? { ...job, bitmap } : job, bitmap ? [bitmap] : []);
							bitmap = undefined;
						} catch {
							reject(new Error('workerUnsupported'));
						}
					});
				} catch (error) {
					bitmap?.close();
					signal.throwIfAborted();

					dispose();

					if (!(error instanceof Error) || !['workerUnsupported', 'workerDecode'].includes(error.message))
						throw error;

					fallback = error.message === 'workerUnsupported';
				}
			}

			const result = await processImage(
				job,
				(image, quality) => codecRequest({ format: 'avif', image, quality }, signal),
				(buffer) => codecRequest({ format: 'png', buffer }, signal),
				(request) => codecRequest(request, signal),
				signal
			);

			signal.throwIfAborted();
			return result;
		},

		dispose() {
			signal.removeEventListener('abort', dispose);
			dispose();
		},
	};
};
