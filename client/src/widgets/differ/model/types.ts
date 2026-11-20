import type { ModalStore } from '@/features/modal';
import type { NotifyStore } from '@/features/notification';

export type ComparisonSide = 'original' | 'modified';
export type ComparisonFilenames = Record<ComparisonSide, string>;

export interface DifferStores {
	modalStore: ModalStore;
	notifyStore: NotifyStore;
}
