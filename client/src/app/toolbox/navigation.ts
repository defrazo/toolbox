import type { TabsStore } from '@/features/tabs';

export const createToolboxActions = (tabsStore: TabsStore) => ({
	openShortener: () => tabsStore.setTab('shortener'),
	pasteUrl: (text: string) => tabsStore.openShortcut('shortener', { type: 'paste-url', payload: text }),
	uploadFiles: () => tabsStore.openShortcut('renamer', { type: 'upload-files' }),
	crop: () => tabsStore.openShortcut('images', { type: 'crop' }),
});
