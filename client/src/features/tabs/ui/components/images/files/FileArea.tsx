import type { RefObject } from 'react';
import { useTranslation } from 'react-i18next';
import { Upload } from 'lucide-react';

import { useDeviceType } from '@/shared/lib/hooks';
import { cn } from '@/shared/lib/utils';

import type { Mode, useImages } from '../../../../model';
import type { ImagePolicy } from '../../../../model/imagePolicy';
import type { ImageFormat } from '../../../../model/types';
import { FileItem } from './FileItem';

type ImagesState = ReturnType<typeof useImages>;
type ImageFile = ImagesState['files'][number];

interface FileAreaProps {
	mode: Exclude<Mode, 'crop'>;
	limitsFor?: (format?: ImageFormat) => ImagePolicy;
	files: ImagesState['files'];
	resizePlans: ImagesState['resizePlans'];
	busy: boolean;
	isProcessing: boolean;
	progress: ImagesState['progress'];
	isDropActive: boolean;
	dragProps: Record<string, unknown>;
	uploadRef: RefObject<HTMLInputElement | null>;
	onRemove: (id: ImageFile['id']) => void;
	onDownload: (file: ImageFile) => void;
}

export const FileArea = ({
	mode,
	limitsFor,
	files,
	resizePlans,
	busy,
	isProcessing,
	progress,
	isDropActive,
	dragProps,
	uploadRef,
	onRemove,
	onDownload,
}: FileAreaProps) => {
	const { t } = useTranslation('images');
	const device = useDeviceType();

	const isEmpty = files.length === 0;
	const showDropZone = isEmpty || isDropActive;
	const errorLimits = (file: ImageFile) => {
		const policy = limitsFor?.(file.format);
		const error = file.error ?? resizePlans.get(file.id)?.error;
		if (!file.width && file.errorLimits && policy && policy.input.maxPixels > file.errorLimits.maxPixels)
			return file.errorLimits;
		return (error === 'outputPixels' || error === 'webpSide' ? policy?.output : policy?.input) ?? file.errorLimits;
	};

	const formats = mode === 'converter' ? 'JPG · PNG · WebP · ICO' : 'JPG · PNG · WebP';

	return (
		<div
			{...dragProps}
			className={cn(
				'group relative flex min-h-[190px] min-w-0 flex-1 flex-col rounded-xl border border-transparent transition-colors duration-200',
				showDropZone && 'border-dashed border-(--accent-primary-hover)/50',
				!isEmpty && 'gap-2',
				isDropActive && 'border-(--accent-primary-hover)'
			)}
		>
			{isEmpty && device !== 'mobile' ? (
				<button
					className={cn(
						'flex min-h-[190px] w-full flex-1 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg bg-(--bg-secondary)/50 px-3 text-center text-(--color-accent) transition-colors duration-200 hover:bg-(--accent-primary-hover)/10 focus-visible:outline focus-visible:outline-(--accent-primary-hover) disabled:pointer-events-none disabled:cursor-default disabled:opacity-60',
						isDropActive && 'bg-(--accent-primary-hover)/10'
					)}
					disabled={busy}
					type="button"
					onClick={() => uploadRef.current?.click()}
				>
					<Upload className={cn('size-14', isDropActive && 'animate-pulse')} />
					<div className="flex flex-col items-center gap-0.5">
						<span className={cn('text-lg font-medium', isDropActive && 'animate-pulse')}>
							{t(($) => $.drop)}
						</span>
						<span className="text-sm text-(--color-tertiary)">{formats}</span>
						<span className="text-sm text-(--color-tertiary)">{t(($) => $.uploadLimits)}</span>
					</div>
				</button>
			) : (
				<>
					<ul aria-label={t(($) => $.files)} className="grid min-w-0 gap-2">
						{files.map((file) => (
							<FileItem
								key={file.id}
								busy={busy}
								file={file}
								maxSide={errorLimits(file)?.maxSide}
								pixelLimit={errorLimits(file)?.maxPixels}
								plan={mode === 'resize' ? resizePlans.get(file.id) : undefined}
								waiting={isProcessing && file.status === 'ready'}
								onDownload={onDownload}
								onRemove={onRemove}
							/>
						))}
					</ul>
					{progress && (
						<p className="hidden text-right text-xs text-(--color-secondary) xl:block" role="status">
							{t(($) => $.batchProgress, { count: progress.completed, total: progress.total })}
						</p>
					)}
				</>
			)}
		</div>
	);
};
