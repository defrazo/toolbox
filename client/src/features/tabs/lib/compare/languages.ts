const EXTENSIONS: Record<string, string> = {
	js: 'javascript',
	jsx: 'javascript',
	mjs: 'javascript',
	cjs: 'javascript',
	ts: 'typescript',
	tsx: 'typescript',
	json: 'json',
	php: 'php',
	phtml: 'php',
	html: 'html',
	htm: 'html',
	css: 'css',
	sql: 'sql',
	xml: 'xml',
	svg: 'xml',
	py: 'python',
};

export const resolveLanguage = (language: string, filename: string): string => {
	if (language === 'auto') {
		const extension = filename.match(/\.([^.]+)$/)?.[1].toLowerCase() ?? '';
		return EXTENSIONS[extension] ?? 'plaintext';
	}
	return language === 'bsl' ? 'plaintext' : language;
};
