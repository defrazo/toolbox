export const formatIndex = (idx: number) => String(idx + 1).padStart(2, '0');

export const buildName = (prefix: string, suffix: string, index: number, originalName: string) => {
	const ext = originalName.split('.').pop();
	return `${prefix}${formatIndex(index)}${suffix}.${ext}`;
};

export const buildRenamedFiles = (files: File[], prefix: string, suffix: string) => {
	return files.map(
		(file, index) => new File([file], buildName(prefix, suffix, index, file.name), { type: file.type })
	);
};
