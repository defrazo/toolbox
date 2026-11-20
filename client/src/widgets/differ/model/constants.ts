import type { ComparisonFilenames, ComparisonSide } from './types';

export const COMPARISON_SIDES = ['original', 'modified'] as const satisfies readonly ComparisonSide[];
export const EMPTY_FILENAMES = { original: '', modified: '' } as const satisfies ComparisonFilenames;
export const MAX_FILE_SIZE = 2 * 1024 * 1024;
