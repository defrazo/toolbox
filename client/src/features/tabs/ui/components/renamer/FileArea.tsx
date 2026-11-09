import type { RefObject } from 'react';
import { useTranslation } from 'react-i18next';
import { Upload } from 'lucide-react';

import { useDropzone } from '@/features/tabs/model';
import { useDeviceType } from '@/shared/lib/hooks';
import { cn } from '@/shared/lib/utils';

import { useRenamerContext } from '../../../model/renamer-context';
import { PreviewContainers } from '.';

export const FileArea = ({ uploadRef }: { uploadRef: RefObject<HTMLInputElement | null> }) => {
	const { t } = useTranslation('renamer');
	const device = useDeviceType();

	const { files, handleIncomingFiles } = useRenamerContext();

	const { isDropActive, dragProps } = useDropzone({ onDrop: handleIncomingFiles });

	const isDesktop = device !== 'mobile';
	const showDropZone = isDesktop && (isDropActive || files.length === 0);

	return (
		<div className="core-gap flex min-h-0 flex-1 flex-col justify-between md:flex-row" tabIndex={-1}>
			<div
				className={cn(
					'group relative flex min-h-0 flex-1 flex-col gap-4 md:flex-row',
					showDropZone && 'rounded-xl border border-dashed border-(--accent-primary-hover)/50',
					isDropActive && 'border-(--accent-primary-hover)'
				)}
				{...dragProps}
			>
				{showDropZone ? (
					<div
						className={cn(
							'absolute inset-0 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg bg-(--bg-secondary)/50 text-(--color-accent) transition-all duration-200 group-hover:bg-(--accent-primary-hover)/10',
							isDropActive && 'bg-(--accent-primary-hover)/10'
						)}
						onClick={() => uploadRef.current?.click()}
					>
						<Upload className={cn('size-14', isDropActive && 'animate-pulse')} />
						<div className="flex flex-col items-center text-lg font-medium">
							<span className={cn(isDropActive && 'animate-pulse')}>{t(($) => $.upload.dropFiles)}</span>
							<span className="text-sm text-(--color-tertiary)">{t(($) => $.upload.hint)}</span>
						</div>
					</div>
				) : (
					<PreviewContainers />
				)}
			</div>
		</div>
	);
};
