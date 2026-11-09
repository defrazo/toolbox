import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { DiffEditor } from '@monaco-editor/react';
import type { editor } from 'monaco-editor';

import { useStore } from '@/app/providers';
import { Preloader } from '@/shared/ui';

import { resolveLanguage } from '../../../lib/compare/languages';
import { useComparisonEditor } from '../../../model/useComparisonEditor';
import { FileHeader } from './FileHeader';
import { Help } from './Help';
import { Navigation } from './Navigation';
import { Toolbar } from './Toolbar';

import '../../../lib/compare/monaco';

const Editor = () => {
	const { t } = useTranslation('compare');

	const { modalStore, notifyStore } = useStore();

	const comparison = useComparisonEditor(() => {
		notifyStore.setNotice(
			t(($) => $.fileError),
			'error'
		);
	});

	const languageOptions = useMemo(
		() => [
			{ value: 'auto', label: t(($) => $.auto) },
			{ value: 'plaintext', label: t(($) => $.plainText) },
			{ value: 'javascript', label: 'JavaScript' },
			{ value: 'typescript', label: 'TypeScript' },
			{ value: 'json', label: 'JSON' },
			{ value: 'php', label: 'PHP' },
			{ value: 'html', label: 'HTML' },
			{ value: 'css', label: 'CSS' },
			{ value: 'sql', label: 'SQL' },
			{ value: 'xml', label: 'XML' },
			{ value: 'python', label: 'Python' },
			{ value: 'bsl', label: t(($) => $.bsl) },
		],
		[t]
	);

	const options = useMemo<editor.IStandaloneDiffEditorConstructionOptions>(
		() => ({
			// Layout
			automaticLayout: true,
			renderSideBySide: true,
			useInlineViewWhenSpaceIsLimited: true,
			renderSideBySideInlineBreakpoint: 900,

			// Editing
			originalEditable: true,
			readOnly: false,
			wordWrap: comparison.wordWrap ? 'on' : 'off',
			diffWordWrap: comparison.wordWrap ? 'on' : 'off',

			// Comparison
			diffAlgorithm: 'advanced',
			ignoreTrimWhitespace: comparison.ignoreWhitespace,
			hideUnchangedRegions: {
				enabled: comparison.hideUnchanged,
			},
			renderIndicators: true,
			renderMarginRevertIcon: false,
			diffCodeLens: false,
			renderGutterMenu: false,

			// Typography
			fontFamily: "'JetBrains Mono', 'Cascadia Code', Consolas, monospace",
			fontSize: 14,
			lineHeight: 21,
			fontLigatures: false,

			// Editor
			lineNumbers: 'on',
			lineNumbersMinChars: 3,
			glyphMargin: false,
			folding: true,
			minimap: { enabled: false },
			scrollBeyondLastLine: false,
			renderLineHighlight: 'line',
			renderLineHighlightOnlyWhenFocus: true,

			// Guides
			guides: { indentation: false, bracketPairs: false },

			// Scrollbars
			scrollbar: {
				vertical: 'auto',
				horizontal: 'auto',
				verticalScrollbarSize: 8,
				horizontalScrollbarSize: 8,
				useShadows: false,
			},

			// Overview
			overviewRulerBorder: false,
			renderOverviewRuler: true,
			diffOverviewRuler: true,

			// Spacing
			padding: { top: 12, bottom: 12 },

			// Accessibility
			originalAriaLabel: t(($) => $.original),
			modifiedAriaLabel: t(($) => $.modified),
		}),
		[comparison.ignoreWhitespace, comparison.wordWrap, comparison.hideUnchanged, t]
	);

	const settings = [
		{
			label: t(($) => $.ignoreWhitespace),
			checked: comparison.ignoreWhitespace,
			onChange: comparison.setIgnoreWhitespace,
			hint: t(($) => $.whitespaceHint),
		},
		{
			label: t(($) => $.wordWrap),
			checked: comparison.wordWrap,
			onChange: comparison.setWordWrap,
		},
		{
			label: t(($) => $.hideUnchanged),
			checked: comparison.hideUnchanged,
			onChange: comparison.setHideUnchanged,
		},
	];

	return (
		<section className="flex min-h-0 min-w-0 flex-1 flex-col gap-2 [&_button:disabled]:opacity-50">
			<Toolbar
				clearLabel={t(($) => $.clear)}
				disabled={!comparison.instance}
				language={comparison.language}
				languageLabel={t(($) => $.language)}
				languageOptions={languageOptions}
				settings={settings}
				settingsLabel="Параметры"
				swapLabel={t(($) => $.swap)}
				onClear={comparison.clear}
				onHelp={() => modalStore.setModal(<Help />)}
				onLanguageChange={comparison.setLanguage}
				onSwap={comparison.swap}
			/>
			<div className="core-border flex min-h-[420px] min-w-0 flex-1 flex-col overflow-hidden bg-(--bg-secondary) xl:min-h-0">
				<div className="grid shrink-0 border-b border-(--border-color) lg:grid-cols-2">
					{(['original', 'modified'] as const).map((side) => (
						<div key={side} className="min-w-0">
							<FileHeader
								disabled={!comparison.instance}
								filename={comparison.filenames[side]}
								title={t(($) => $[side])}
								uploadLabel={t(($) => $.upload)}
								onLoad={(event) => void comparison.loadFile(side, event)}
							/>
						</div>
					))}
				</div>
				<div className="min-h-0 min-w-0 flex-1">
					<DiffEditor
						height="100%"
						keepCurrentModifiedModel
						keepCurrentOriginalModel
						loading={<Preloader className="size-8" />}
						modified=""
						modifiedLanguage={resolveLanguage(comparison.language, comparison.filenames.modified)}
						options={options}
						original=""
						originalLanguage={resolveLanguage(comparison.language, comparison.filenames.original)}
						theme={comparison.theme}
						onMount={comparison.onMount}
					/>
				</div>
				<Navigation
					disabled={!comparison.changes || !comparison.instance}
					nextLabel={t(($) => $.next)}
					previousLabel={t(($) => $.previous)}
					status={
						comparison.changes === null
							? t(($) => $.calculating)
							: t(($) => $.changes, { count: comparison.changes })
					}
					onNext={() => comparison.goToDiff('next')}
					onPrevious={() => comparison.goToDiff('previous')}
				/>
			</div>
		</section>
	);
};

export default Editor;
