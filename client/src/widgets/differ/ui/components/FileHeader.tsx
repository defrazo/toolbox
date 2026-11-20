import { type ChangeEvent, useRef } from 'react';
import { Upload } from 'lucide-react';

import { Button } from '@/shared/ui';

interface FileHeaderProps {
	title: string;
	filename: string;
	uploadLabel: string;
	disabled: boolean;
	onLoad: (event: ChangeEvent<HTMLInputElement>) => void;
}

export const FileHeader = ({ title, filename, uploadLabel, disabled, onLoad }: FileHeaderProps) => {
	const inputRef = useRef<HTMLInputElement>(null);

	return (
		<div className="flex h-11 min-w-0 items-center justify-between gap-2 px-2 sm:px-3">
			<div className="min-w-0 flex-1">
				<span className="block truncate text-xs font-medium select-none" title={filename || title}>
					{filename || title}
				</span>
			</div>
			<input ref={inputRef} className="sr-only" tabIndex={-1} type="file" onChange={onLoad} />
			<Button
				centerIcon={<Upload className="size-4" />}
				disabled={disabled}
				size="sm"
				title={uploadLabel}
				onClick={() => inputRef.current?.click()}
			/>
		</div>
	);
};
