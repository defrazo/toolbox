import { type RefObject, useEffect } from 'react';
import { reaction } from 'mobx';

import type { TabsStore } from './tabsStore';

export const useShortcutUpload = (
	tabsStore: Pick<TabsStore, 'shortcut' | 'consumeShortcut'>,
	type: 'upload-files' | 'crop',
	inputRef: RefObject<HTMLInputElement | null>,
	enabled = true
) => {
	useEffect(() => {
		if (!enabled) return;

		return reaction(
			() => tabsStore.shortcut,
			(request) => {
				const input = inputRef.current;

				if (!request || request.type !== type || !input || input.disabled) return;
				if (!tabsStore.consumeShortcut(request.id)) return;

				input.focus();

				if (!navigator.userActivation?.isActive) return;

				try {
					if (input.showPicker) input.showPicker();
					else input.click();
				} catch {}
			},
			{ fireImmediately: true }
		);
	}, [enabled, inputRef, tabsStore, type]);
};
