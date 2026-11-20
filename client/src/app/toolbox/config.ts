export const TOOLBOX_TAB_IDS = ['home', 'images', 'compare', 'renamer', 'shortener', 'links', 'settings'] as const;

export type ToolboxTabId = (typeof TOOLBOX_TAB_IDS)[number];

export const TOOLBOX_TABS = { tabs: TOOLBOX_TAB_IDS, defaultTab: 'home' } as const;
