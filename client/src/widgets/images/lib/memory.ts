import { checkImageMemory, imageMemoryBudget } from '../model/imagePolicy';
import type { ImageJob } from './processImage';

const MB = 1024 * 1024;

const MEMORY_ERROR_PATTERN =
	/out[ -]of[ -]memory|(?:cannot|could not|failed to|unable to) (?:allocate|grow).*memory|allocation (?:failed|failure)|(?:array ?buffer|typed array).*(?:allocation|memory|invalid.*length)|invalid (?:array ?buffer|typed array) length/i;

export const BATCH_PROCESSING = { maxActive: 2, parallelReserve: 64 * MB };

export const isMemoryAllocationError = (error: unknown): boolean => {
	const message = typeof error === 'string' ? error : error instanceof Error ? error.message : '';
	return message === 'memoryAllocation' || MEMORY_ERROR_PATTERN.test(message);
};

export const retainedImageBytes = (rows: { file: Blob; result?: { blob: Blob } }[]): number => {
	const blobs = new Set<Blob>();

	for (const row of rows) {
		blobs.add(row.file);
		if (row.result) blobs.add(row.result.blob);
	}

	let total = 0;
	for (const blob of blobs) total += blob.size;

	return total;
};

export const estimateImageJobBytes = (job: ImageJob, width: number, height: number): number => {
	const source = width * height;
	const output = job.mode === 'resize' && !job.plan.error ? job.plan.width * job.plan.height : source;

	if (job.mode === 'compression' && job.format === 'png') return source * 32 + 64 * MB;

	if (job.format === 'ico') return Math.max(source, output) * 24 + 32 * MB;

	return Math.max(source * 8 + output * 8, output * 16) + 32 * MB;
};

export const admitImageJob = (temporary: number, retained: number, budget = imageMemoryBudget()): void => {
	checkImageMemory(temporary, retained, budget);
};

export const canShareImageBudget = (job: ImageJob, temporary: number, budget: number): boolean =>
	Number.isFinite(temporary) &&
	temporary <= budget / 4 &&
	job.format !== 'ico' &&
	!(job.mode === 'converter' && job.output === 'ico') &&
	!(job.mode === 'compression' && job.format === 'png');
