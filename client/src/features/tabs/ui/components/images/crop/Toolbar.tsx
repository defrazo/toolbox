import type { RefObject } from 'react';
import { useTranslation } from 'react-i18next';
import { Upload } from 'lucide-react';

import { cn } from '@/shared/lib/utils';
import { FileUploader } from '@/shared/ui';

import { IMAGES } from '../../../../model';

interface ToolbarProps {
	busy: boolean;
	uploadRef: RefObject<HTMLInputElement | null>;
	onAddFiles: (files: File[]) => void | Promise<void>;
}

export const Toolbar = ({ busy, uploadRef, onAddFiles }: ToolbarProps) => {
	const { t } = useTranslation('images');

	return (
		<div className="core-border flex h-13 min-w-0 shrink-0 items-center overflow-hidden bg-(--bg-tertiary)/70 p-1 shadow-(--shadow)">
			<FileUploader
				ref={uploadRef}
				accept={IMAGES.COMPRESSION.ACCEPT}
				className={cn(
					'active-btn h-full min-w-0 flex-1 rounded-lg',
					busy && 'text-(--color-secondary) opacity-50'
				)}
				disabled={busy}
				icon={<Upload className="size-4" />}
				id="crop-upload"
				multiple={false}
				selectedFileName={t(($) => $.crop.upload)}
				onUpload={onAddFiles}
			/>
		</div>
	);
};
