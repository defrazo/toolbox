import type { ChangeEvent, ReactNode } from 'react';

import { cn } from '@/shared/lib/utils';
import { Input } from '@/shared/ui';

interface FileUploaderProps {
	selectedFileName?: string;
	onUpload: (e: ChangeEvent<HTMLInputElement>) => void;
	icon?: ReactNode;
	className?: string;
}

const FileUploader = ({ selectedFileName, onUpload, icon, className }: FileUploaderProps) => (
	<label
		className={cn(
			'inline-block cursor-pointer px-4 py-2 text-center text-base ring-(--accent-primary-hover) select-none ring-inset focus-visible:ring-1',
			className
		)}
	>
		<div className="flex items-center justify-center gap-2">
			{icon}
			<span className={selectedFileName && 'text-sm'}>{selectedFileName || 'Выберите файлы'}</span>
		</div>
		<Input className="hidden" multiple type="file" onChange={onUpload} />
	</label>
);

export default FileUploader;
