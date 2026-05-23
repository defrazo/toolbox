import { type DragEvent, useState } from 'react';

export const useDropzone = ({ onDrop }: { onDrop: (files: File[]) => void }) => {
	const [isDropActive, setIsDropActive] = useState(false);

	const handleDragOver = (e: DragEvent<HTMLElement>) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDropActive(true);
	};

	const handleDragLeave = (e: DragEvent<HTMLElement>) => {
		e.preventDefault();
		e.stopPropagation();

		if (e.currentTarget.contains(e.relatedTarget as Node)) return;

		setIsDropActive(false);
	};

	const handleDrop = (e: DragEvent<HTMLElement>) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDropActive(false);

		const droppedFiles = Array.from(e.dataTransfer.files);
		if (droppedFiles.length) onDrop(droppedFiles);
	};

	return {
		isDropActive,
		dragProps: {
			onDragOver: handleDragOver,
			onDragLeave: handleDragLeave,
			onDrop: handleDrop,
		},
	};
};
