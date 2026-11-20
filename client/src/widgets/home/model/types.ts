import type { Tool } from '@/entities/tool';
import type { UserStore } from '@/entities/user';
import type { NotifyStore } from '@/features/notification';
import type { TabsStore } from '@/features/tabs';

export type HomeActions = {
	openShortener: () => void;
	pasteUrl: (text: string) => void;
	uploadFiles: () => void;
	crop: () => void;
};

export type HomeTool = Pick<Tool, 'id' | 'icon' | 'isDisabled'> & { title: string; subtitle: string };

export interface HomeStores {
	notifyStore: NotifyStore;
	tabsStore: TabsStore;
	userStore: UserStore;
}
