import { type RefObject } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';

import { cn } from '@/shared/lib/utils';
import { FileUploader } from '@/shared/ui';

import { IMAGES, type Mode } from '../../../../model';

interface ToolbarProps {
	mode: Exclude<Mode, 'crop'>;
	busy: boolean;
	uploadRef: RefObject<HTMLInputElement | null>;
	onAddFiles: (files: File[]) => void | Promise<void>;
}

export const Toolbar = ({ mode, busy, uploadRef, onAddFiles }: ToolbarProps) => {
	const { t } = useTranslation('images');

	return (
		<div className="core-border flex h-13 min-w-0 shrink-0 items-center overflow-hidden bg-(--bg-tertiary)/70 p-1 shadow-(--shadow)">
			<FileUploader
				ref={uploadRef}
				accept={
					mode === 'converter' || mode === 'background' ? IMAGES.CONVERTER.ACCEPT : IMAGES.COMPRESSION.ACCEPT
				}
				className={cn(
					'active-btn h-full min-w-0 flex-1 rounded-lg',
					busy && 'bg-none text-(--color-secondary) opacity-100'
				)}
				disabled={busy}
				icon={<Plus className="size-4" />}
				id="images-upload"
				selectedFileName={t(($) => $.add)}
				onUpload={onAddFiles}
			/>
		</div>
	);
};
