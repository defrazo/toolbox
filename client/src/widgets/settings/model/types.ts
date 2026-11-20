import type { UserStore } from '@/entities/user';
import type { ThemeStore } from '@/features/theme-switcher';

export interface SettingsWidgetProps {
	userStore: Pick<
		UserStore,
		'user' | 'username' | 'email' | 'hasPendingEmail' | 'pendingEmail' | 'setUser' | 'avatarId' | 'avatar'
	>;
	themeStore: Pick<ThemeStore, 'theme' | 'setTheme'>;
	onNotice: (message: string, type: 'info' | 'success' | 'error') => void;
}
