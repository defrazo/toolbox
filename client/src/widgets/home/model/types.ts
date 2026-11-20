import type { Tool, ToolId } from '@/entities/tool';

export type HomeActions = {
	openShortener: () => void;
	pasteUrl: (text: string) => void;
	uploadFiles: () => void;
	crop: () => void;
};

export type HomeTool = Pick<Tool, 'id' | 'icon' | 'isDisabled'> & { title: string; subtitle: string };

export interface HomeWidgetProps {
	username?: string;
	tools: readonly HomeTool[];
	actions: HomeActions;
	onNavigate: (id: ToolId) => void;
	onNotice: (message: string, type: 'info' | 'error') => void;
}
