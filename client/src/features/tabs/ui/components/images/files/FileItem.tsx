import { useTranslation } from 'react-i18next';
import { Download, Image, MoveRight, Trash2 } from 'lucide-react';

import { i18n } from '@/shared/config/i18n';
import { cn } from '@/shared/lib/utils';
import { Button, Preloader } from '@/shared/ui';

import { formatFileSize, formatSizeChange } from '../../../../lib';
import type { useImages } from '../../../../model';
import { DEFAULT_IMAGE_LIMITS } from '../../../../model/imagePolicy';

type ImagesState = ReturnType<typeof useImages>;
type ImageFile = ImagesState['files'][number];
type ResizePlan = NonNullable<ReturnType<ImagesState['resizePlans']['get']>>;

interface FileItemProps {
	file: ImageFile;
	plan?: ResizePlan;
	busy: boolean;
	waiting?: boolean;
	pixelLimit?: number;
	maxSide?: number;
	onRemove: (id: ImageFile['id']) => void;
	onDownload: (file: ImageFile) => void;
}

export const FileItem = ({
	file,
	plan,
	busy,
	waiting = false,
	pixelLimit,
	maxSide,
	onRemove,
	onDownload,
}: FileItemProps) => {
	const { t } = useTranslation('images');

	const { result } = file;

	const current = file.status === 'done' && !!result;
	const error = file.error ?? plan?.error;
	const hasOriginal = !!file.url;

	const status = waiting
		? t(($) => $.waiting)
		: error
			? t(($) => $.errors[error], {
					megapixels: (pixelLimit ?? DEFAULT_IMAGE_LIMITS.maxPixels) / 1_000_000,
					maxSide: maxSide ?? DEFAULT_IMAGE_LIMITS.maxSide,
				})
			: result && !current
				? t(($) => $.stale)
				: file.status === 'ready' || file.status === 'done'
					? null
					: t(($) => $.status[file.status]);

	const difference = result ? result.blob.size - file.file.size : 0;

	const sizeChange = result
		? formatSizeChange(file.file.size, result.blob.size, i18n.resolvedLanguage ?? 'ru')
		: null;

	const sizeChangeLabel = result
		? difference === 0
			? t(($) => $.compression.unchanged)
			: t(($) => $.compression[difference > 0 ? 'increased' : 'reduced'], {
					percent: formatSizeChange(file.file.size, result.blob.size, i18n.resolvedLanguage ?? 'ru').replace(
						/^[+-]/,
						''
					),
				})
		: '';

	return (
		<li className={cn('flex min-w-0 items-center gap-3 rounded-xl bg-(--bg-tertiary)/70 p-3')}>
			{hasOriginal ? (
				<div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-(--border-color) bg-(--bg-secondary)">
					<img alt={t(($) => $.original)} className="size-full object-contain" src={file.url} />
				</div>
			) : (
				<div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-(--bg-secondary)">
					<Image className="size-6 text-(--color-disabled)" />
				</div>
			)}
			<div className="mb-0.5 flex min-w-0 flex-1 flex-col">
				<span className="block truncate text-sm font-medium" title={file.file.name}>
					{file.file.name}
				</span>
				<div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-xs text-(--color-secondary)">
					<span>{formatFileSize(file.file.size)}</span>
					{result && (
						<span
							className={cn('flex flex-wrap items-center gap-x-1.5 gap-y-0.5', !current && 'opacity-50')}
						>
							<MoveRight aria-hidden="true" className="size-3 shrink-0" />
							<span>{formatFileSize(result.blob.size)}</span>
							<span
								aria-label={sizeChangeLabel}
								className={cn(
									difference > 0 && 'text-(--status-error)',
									difference < 0 && 'text-(--status-success)'
								)}
								title={sizeChangeLabel}
							>
								{sizeChange}
							</span>
						</span>
					)}
				</div>
				{status && (
					<div className="flex items-center gap-1">
						{(file.status === 'loading' || file.status === 'processing') && (
							<Preloader className="size-3 shrink-0 border-2" />
						)}
						<span
							className={cn(
								'text-xs wrap-anywhere text-(--color-secondary)',
								error && 'text-(--status-error)'
							)}
						>
							{status}
						</span>
					</div>
				)}
			</div>
			<div className="flex shrink-0 items-center gap-1">
				{current && (
					<>
						<Button
							aria-label={t(($) => $.download)}
							centerIcon={<Download className="size-4" />}
							className="size-8 rounded-lg"
							size="custom"
							title={t(($) => $.download)}
							onClick={() => onDownload(file)}
						/>
					</>
				)}
				<Button
					aria-label={t(($) => $.remove)}
					centerIcon={<Trash2 className="size-4" />}
					className="size-8 rounded-lg"
					disabled={busy}
					size="custom"
					title={t(($) => $.remove)}
					onClick={() => onRemove(file.id)}
				/>
			</div>
		</li>
	);
};
