import { makeAutoObservable, reaction } from 'mobx';

import type { Theme } from '.';

export class ThemeStore {
	theme: Theme = 'system';

	get currentTheme(): 'Светлая' | 'Темная' {
		return this.theme === 'light' ? 'Светлая' : 'Темная';
	}

	setTheme(theme: Theme): void {
		this.theme = theme;
		this.applyTheme(theme);
	}

	toggleTheme(): void {
		this.setTheme(this.theme === 'dark' ? 'light' : 'dark');
	}

	private getSystemTheme(): 'light' | 'dark' {
		return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
	}

	private applyTheme(theme: Theme): void {
		if (typeof document === 'undefined') return;

		const resolved = theme === 'system' ? this.getSystemTheme() : theme;

		document.documentElement.classList.remove('light-theme', 'dark-theme');
		document.documentElement.classList.add(`${resolved}-theme`);
		document.documentElement.style.colorScheme = resolved;
	}

	constructor() {
		makeAutoObservable(this);

		const savedTheme = localStorage.getItem('theme') as Theme | null;

		if (savedTheme) {
			this.theme = savedTheme;
			this.applyTheme(savedTheme);
		}

		reaction(
			() => this.theme,
			(theme) => localStorage.setItem('theme', theme)
		);

		window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
			if (this.theme === 'system') this.applyTheme('system');
		});
	}
}
