import { useMemo, useState } from 'react';

import { buildName } from '../lib';

export const useRenamer = () => {
	const [files, setFiles] = useState<File[]>([]);
	const [prefix, setPrefix] = useState('');
	const [suffix, setSuffix] = useState('');

	const preview = useMemo(() => {
		return files.map((file, i) => ({
			oldName: file.name,
			newName: buildName(prefix, suffix, i, file.name),
		}));
	}, [files, prefix, suffix]);

	const clearName = () => {
		setPrefix('');
		setSuffix('');
	};

	const reset = () => {
		setFiles([]);
		clearName();
	};

	return {
		files,
		setFiles,
		prefix,
		setPrefix,
		suffix,
		setSuffix,
		preview,
		clearName,
		reset,
	};
};
