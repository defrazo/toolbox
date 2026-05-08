import type { ChangeEvent, ReactNode } from 'react';

import { cn } from '@/shared/lib/utils';

interface FileUploaderProps {
	id?: string;
	selectedFileName?: string;
	onUpload: (e: ChangeEvent<HTMLInputElement>) => void;
	icon?: ReactNode;
	disabled?: boolean;
	className?: string;
}

const FileUploader = ({ id, selectedFileName, onUpload, icon, disabled, className }: FileUploaderProps) => (
	<label
		className={cn(
			'relative flex cursor-pointer items-center justify-center gap-2 rounded-xl px-4 py-2 text-center text-(--accent-primary-text) select-none',
			'focus-within:ring-1 focus-within:ring-(--accent-primary-hover)',
			disabled && 'pointer-events-none text-(--color-disabled) opacity-30',
			className
		)}
	>
		<input
			className="absolute size-px opacity-0"
			disabled={disabled}
			id={id}
			multiple
			type="file"
			onChange={onUpload}
		/>
		{icon}
		<span className={cn(selectedFileName && 'text-sm text-nowrap')}>{selectedFileName || 'Загрузить файлы'}</span>
	</label>
);

export default FileUploader;
