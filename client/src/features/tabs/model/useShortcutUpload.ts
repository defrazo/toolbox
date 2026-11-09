import { type RefObject, useEffect } from 'react';
import { reaction } from 'mobx';

import { useStore } from '@/app/providers/store';

export const useShortcutUpload = (
	type: 'upload-files' | 'background' | 'crop',
	inputRef: RefObject<HTMLInputElement | null>,
	enabled = true
) => {
	const { tabsStore } = useStore();

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
