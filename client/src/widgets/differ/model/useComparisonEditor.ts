import { type ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import type { DiffOnMount } from '@monaco-editor/react';
import type { editor } from 'monaco-editor';

import { COMPARISON_SIDES, EMPTY_FILENAMES, MAX_FILE_SIZE } from './constants';
import type { ComparisonFilenames, ComparisonSide } from './types';

export const useComparisonEditor = (onFileError: () => void) => {
	const [instance, setInstance] = useState<editor.IStandaloneDiffEditor | null>(null);
	const [filenames, setFilenames] = useState<ComparisonFilenames>(EMPTY_FILENAMES);
	const [changes, setChanges] = useState<number | null>(0);
	const [language, setLanguage] = useState('auto');
	const [ignoreWhitespace, setIgnoreWhitespace] = useState(false);
	const [wordWrap, setWordWrap] = useState(false);
	const [hideUnchanged, setHideUnchanged] = useState(false);
	const [theme, setTheme] = useState<'vs-dark' | 'light'>(() =>
		document.documentElement.classList.contains('dark-theme') ? 'vs-dark' : 'light'
	);

	const text = useRef<ComparisonFilenames>({ ...EMPTY_FILENAMES });
	const reads = useRef<Record<ComparisonSide, number>>({ original: 0, modified: 0 });
	const fileErrorRef = useRef(onFileError);
	fileErrorRef.current = onFileError;

	useEffect(() => {
		const observer = new MutationObserver(() => {
			setTheme(document.documentElement.classList.contains('dark-theme') ? 'vs-dark' : 'light');
		});

		observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

		return () => observer.disconnect();
	}, []);

	useEffect(
		() => () => {
			COMPARISON_SIDES.forEach((side) => {
				reads.current[side] += 1;
			});
		},
		[]
	);

	useEffect(() => {
		if (!instance) return;

		const disposables = COMPARISON_SIDES.map((side) => {
			const pane = side === 'original' ? instance.getOriginalEditor() : instance.getModifiedEditor();
			return pane.onDidChangeModelContent(() => {
				text.current[side] = pane.getValue();
				reads.current[side] += 1;
				setChanges(null);
			});
		});

		const updateChanges = () => setChanges(instance.getLineChanges()?.length ?? null);
		disposables.push(instance.onDidUpdateDiff(updateChanges));
		updateChanges();

		return () => disposables.forEach((disposable) => disposable.dispose());
	}, [instance]);

	const onMount: DiffOnMount = useCallback((diffEditor) => {
		const models = diffEditor.getModel();

		const cleanup = diffEditor.getModifiedEditor().onDidDispose(() => {
			cleanup.dispose();

			queueMicrotask(() => {
				if (models?.original && !models.original.isDisposed()) models.original.dispose();
				if (models?.modified && !models.modified.isDisposed()) models.modified.dispose();
			});
		});

		diffEditor.getOriginalEditor().setValue(text.current.original);
		diffEditor.getModifiedEditor().setValue(text.current.modified);

		setInstance(diffEditor);
	}, []);

	const getPane = useCallback(
		(side: ComparisonSide) => (side === 'original' ? instance?.getOriginalEditor() : instance?.getModifiedEditor()),
		[instance]
	);

	const loadFile = useCallback(
		async (side: ComparisonSide, event: ChangeEvent<HTMLInputElement>) => {
			const file = event.currentTarget.files?.[0];
			event.currentTarget.value = '';
			if (!file) return;

			const version = ++reads.current[side];

			try {
				if (file.size > MAX_FILE_SIZE) throw new Error('fileSize');

				const buffer = await file.arrayBuffer();

				if (version !== reads.current[side]) return;

				const value = new TextDecoder('utf-8', { fatal: true }).decode(buffer);
				if (value.includes('\0')) throw new Error('binaryFile');
				if (version !== reads.current[side]) return;

				text.current[side] = value;
				getPane(side)?.setValue(value);
				setFilenames((current) => ({ ...current, [side]: file.name }));
			} catch {
				if (version === reads.current[side]) fileErrorRef.current();
			}
		},
		[getPane]
	);

	const swap = useCallback(() => {
		if (!instance) return;

		COMPARISON_SIDES.forEach((side) => {
			reads.current[side] += 1;
		});

		const { original, modified } = text.current;

		instance.getOriginalEditor().setValue(modified);
		instance.getModifiedEditor().setValue(original);
		text.current = { original: modified, modified: original };

		setFilenames(({ original, modified }) => ({ original: modified, modified: original }));
	}, [instance]);

	const clear = useCallback(() => {
		if (!instance) return;

		COMPARISON_SIDES.forEach((side) => {
			reads.current[side] += 1;
			text.current[side] = '';
			getPane(side)?.setValue('');
		});

		setFilenames({ ...EMPTY_FILENAMES });
	}, [instance, getPane]);

	const goToDiff = useCallback(
		(direction: 'previous' | 'next') => {
			instance?.goToDiff(direction);
		},
		[instance]
	);

	return {
		instance,
		filenames,
		changes,
		language,
		setLanguage,
		ignoreWhitespace,
		setIgnoreWhitespace,
		wordWrap,
		setWordWrap,
		hideUnchanged,
		setHideUnchanged,
		theme,
		onMount,
		loadFile,
		swap,
		clear,
		goToDiff,
	};
};
