import eslintPluginImport from 'eslint-plugin-import';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import eslintPluginSimpleImportSort from 'eslint-plugin-simple-import-sort';
import typescriptEslintPlugin from '@typescript-eslint/eslint-plugin';
import eslintPluginReact from 'eslint-plugin-react';
import typescriptParser from '@typescript-eslint/parser';

export default [
	{
		ignores: ['dist', 'node_modules','env.d.ts', 'vite.config.ts', 'tailwind.config.js'],
	},
	{
		files: ['**/*.ts', '**/*.tsx'],
		languageOptions: {
			parser: typescriptParser,
			parserOptions: {
				ecmaVersion: 'latest',
				sourceType: 'module',
				project: './tsconfig.eslint.json'
			},
			globals: {
				window: 'readonly',
				document: 'readonly',
				console: 'readonly',
			},
		},
		plugins: {
			'@typescript-eslint': typescriptEslintPlugin,
			prettier: eslintPluginPrettier,
			'simple-import-sort': eslintPluginSimpleImportSort,
			react: eslintPluginReact,
			import: eslintPluginImport,
		},
		settings: {
			react: {
				version: 'detect',
			},
			'import/resolver': {
				typescript: {
				project: './tsconfig.eslint.json',
				},
				node: true,
			},
		},
		rules: {
			'@typescript-eslint/no-unused-vars': ["warn", {
				"argsIgnorePattern": "^_",
				"varsIgnorePattern": "^_",
				"caughtErrorsIgnorePattern": "^_"
			}],
			'no-console': 'off',
			'array-bracket-newline': ['off'],
			'array-element-newline': ['off'],
			'prettier/prettier': 'error',
			'simple-import-sort/imports': [
				'warn',
				{
					groups: [['^react', '^@?\\w'], ['^@/'], ['^\\.'], ['\\.s?css$']],
				},
			],
			'simple-import-sort/exports': 'warn',
			'react/jsx-sort-props': [
				'warn',
				{
					callbacksLast: true,
					shorthandFirst: false,
					noSortAlphabetically: false,
					reservedFirst: true,
				},
			],

			'import/no-cycle': [
				'error',
					{
						maxDepth: Infinity,
						ignoreExternal: true,
						allowUnsafeDynamicCyclicDependency: false,
					},
			],

			'no-restricted-syntax': [
				'error',
				{
					selector:
						"ImportDeclaration[importKind!='type'][source.value=/\\.worker(\\.[cm]?[jt]sx?)?$/]",
					message:
						'Worker entry points must not be imported as regular modules. Use new Worker(new URL(...)) instead.',
				},
				{
					selector:
					"ExportNamedDeclaration[source.value=/\\.worker(\\.[cm]?[jt]sx?)?$/]",
					message:
					'Do not re-export Worker entry points through barrel files.',
				},
				{
					selector:
					"ExportAllDeclaration[source.value=/\\.worker(\\.[cm]?[jt]sx?)?$/]",
					message:
					'Do not re-export Worker entry points through barrel files.',
				},
			],
		},
	},	
];