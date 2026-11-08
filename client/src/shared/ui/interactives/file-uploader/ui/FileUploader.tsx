import { type ChangeEvent, forwardRef, type ReactNode } from 'react';

import { cn } from '@/shared/lib/utils';

interface FileUploaderProps {
	accept?: string;
	multiple?: boolean;
	id?: string;
	selectedFileName?: string;
	onUpload: (files: File[]) => void | Promise<void>;
	icon?: ReactNode;
	disabled?: boolean;
	className?: string;
}

export const FileUploader = forwardRef<HTMLInputElement, FileUploaderProps>(
	({ accept, multiple = true, id, selectedFileName, onUpload, icon, disabled, className }, ref) => {
		const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
			const input = event.currentTarget;
			const files = input.files;

			if (files?.length) void onUpload(Array.from(files));
			input.value = '';
		};

		return (
			<label
				className={cn(
					'relative flex cursor-pointer items-center justify-center gap-2 rounded-xl px-4 py-2 text-center text-(--accent-primary-text) select-none',
					'focus-within:ring-1 focus-within:ring-(--accent-primary-hover)',
					disabled && 'pointer-events-none text-(--color-disabled) opacity-30',
					className
				)}
			>
				<input
					ref={ref}
					accept={accept}
					className="absolute size-px opacity-0"
					disabled={disabled}
					id={id}
					multiple={multiple}
					type="file"
					onChange={handleChange}
				/>
				{icon}
				<span className={cn('trim', selectedFileName && 'text-sm text-nowrap')}>
					{selectedFileName || 'Загрузить файлы'}
				</span>
			</label>
		);
	}
);
