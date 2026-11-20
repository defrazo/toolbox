import type { ReactNode } from 'react';

export type ComparisonSide = 'original' | 'modified';
export type ComparisonFilenames = Record<ComparisonSide, string>;

export interface DifferWidgetProps {
	onError: (message: string) => void;
	onOpenHelp: (content: ReactNode) => void;
}
