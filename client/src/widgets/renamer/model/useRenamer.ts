import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { buildName } from '../lib/naming';
import { MAX_FILES, MAX_SIZE } from './constants';
import type { AddFilesResult, PreviewFile } from './types';

export const useRenamer = (onError: (message: string) => void) => {
	const { t } = useTranslation('renamer');

	const [files, setFiles] = useState<File[]>([]);
	const [prefix, setPrefix] = useState('');
	const [suffix, setSuffix] = useState('');

	const preview = useMemo<PreviewFile[]>(() => {
		return files.map((file, idx) => ({
			oldName: file.name,
			newName: buildName(prefix, suffix, idx, file.name),
		}));
	}, [files, prefix, suffix]);

	const addFiles = (incomingFiles: File[]): AddFilesResult => {
		const validBySize = incomingFiles.filter((file) => file.size <= MAX_SIZE);

		const rejectedBySize = incomingFiles.filter((file) => file.size > MAX_SIZE);

		const remainingSlots = Math.max(MAX_FILES - files.length, 0);

		const accepted = validBySize.slice(0, remainingSlots);

		setFiles((prev) => [...prev, ...accepted]);

		return {
			added: accepted.length,
			rejectedByLimit: validBySize.length - accepted.length,
			rejectedBySize,
		};
	};

	const notifyAddFiles = (result: ReturnType<typeof addFiles>) => {
		result.rejectedBySize.forEach((file) => {
			onError(t(($) => $.errors.tooLarge, { file: file.name }));
		});

		if (result.rejectedByLimit > 0) onError(t(($) => $.errors.tooMany, { count: result.rejectedByLimit }));
	};

	const handleIncomingFiles = (incoming: File[]) => {
		const result = addFiles(incoming);

		notifyAddFiles(result);
	};

	const reset = () => {
		setFiles([]);
		setPrefix('');
		setSuffix('');
	};

	return { files, prefix, setPrefix, suffix, setSuffix, preview, addFiles, handleIncomingFiles, reset };
};
