import { imagePolicy } from '../model/imagePolicy';
import type { ImageWorkerRequest } from '../model/types';
import { createCanvas, loadImage } from './converter';
import { checkOutputDimensions } from './dimensions';
import { isMemoryAllocationError } from './memory';
import { type ImageJob, type ImageJobResult, processImage } from './processImage';
import type { ProcessingResponse } from './processing.worker';

const prepareJpegResize = async (job: Extract<ImageJob, { mode: 'resize' }>, signal: AbortSignal) => {
	if (job.plan.error) throw new Error(job.plan.error);
	if (typeof createImageBitmap !== 'function') throw new Error('workerUnsupported');

	const { width, height } = job.plan;

	const policy = job.policy ?? imagePolicy({ mode: 'resize', format: job.format });
	checkOutputDimensions(width, height, policy.output, job.format);

	const image = await loadImage(job.file, signal, policy.input);

	let surface: ReturnType<typeof createCanvas> | undefined;

	try {
		surface = createCanvas(width, height);
		const { canvas, context } = surface;

		signal.throwIfAborted();

		context.drawImage(image, 0, 0, width, height);

		let bitmap: ImageBitmap;

		try {
			bitmap = await createImageBitmap(canvas);
		} catch (error) {
			signal.throwIfAborted();
			if (isMemoryAllocationError(error)) throw new Error('memoryAllocation');
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

export { estimateImageJobBytes } from './memory';

const codecRequest = (data: ImageWorkerRequest, signal: AbortSignal): Promise<ArrayBuffer> =>
	new Promise((resolve, reject) => {
		signal.throwIfAborted();

		const worker = new Worker(new URL('./image.worker.ts', import.meta.url), { type: 'module' });

		const cleanup = () => {
			clearTimeout(timer);
			signal.removeEventListener('abort', abort);
			worker.terminate();
		};

		const abort = () => {
			cleanup();
			reject(signal.reason);
		};

		const timer = setTimeout(() => {
			cleanup();
			reject(new Error('timeout'));
		}, 180_000);

		signal.addEventListener('abort', abort, { once: true });

		worker.onmessage = ({ data: result }: MessageEvent<{ buffer?: ArrayBuffer; error?: string }>) => {
			cleanup();
			if (result.buffer) resolve(result.buffer);
			else reject(new Error(result.error ?? 'encode'));
		};

		worker.onerror = (event) => {
			event.preventDefault();
			cleanup();
			reject(new Error(isMemoryAllocationError(event.message) ? 'memoryAllocation' : 'encode'));
		};

		worker.onmessageerror = () => {
			cleanup();
			reject(new Error('encode'));
		};

		try {
			worker.postMessage(data, [data.buffer]);
		} catch (error) {
			cleanup();
			reject(error);
		}
	});

export const createImageProcessor = (signal: AbortSignal) => {
	let worker: Worker | null = null;
	let fallback = false;
	let rejectPending: ((reason: unknown) => void) | undefined;
	let timer: ReturnType<typeof setTimeout> | undefined;

	const dispose = () => {
		clearTimeout(timer);
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
						timer = setTimeout(() => {
							rejectPending = undefined;
							dispose();
							reject(new Error('timeout'));
						}, 180_000);

						activeWorker.onmessage = ({ data }: MessageEvent<ProcessingResponse>) => {
							if (worker !== activeWorker || data.id !== job.id) return;
							clearTimeout(timer);

							rejectPending = undefined;

							if ('result' in data) resolve(data.result);
							else reject(new Error(data.error));
						};
						const fail = (message?: string) => {
							if (worker !== activeWorker) return;

							const rejectCurrent = rejectPending;

							rejectPending = undefined;
							dispose();
							rejectCurrent?.(
								new Error(isMemoryAllocationError(message) ? 'memoryAllocation' : 'workerUnsupported')
							);
						};

						activeWorker.onerror = (event) => {
							event.preventDefault();
							fail(event.message);
						};

						activeWorker.onmessageerror = () => fail();

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

			const result = await processImage(job, (buffer) => codecRequest({ format: 'png', buffer }, signal), signal);

			signal.throwIfAborted();
			return result;
		},

		dispose() {
			signal.removeEventListener('abort', dispose);
			dispose();
		},
	};
};
