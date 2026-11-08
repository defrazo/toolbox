import { useTranslation } from 'react-i18next';
import { Download, Eye, Image, MoveRight, Trash2 } from 'lucide-react';

import { i18n } from '@/shared/config/i18n';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui';

import { formatFileSize, formatSizeChange } from '../../../../lib';
import type { useImages } from '../../../../model';

type ImagesState = ReturnType<typeof useImages>;
type ImageFile = ImagesState['files'][number];
type ResizePlan = NonNullable<ReturnType<ImagesState['resizePlans']['get']>>;

interface FileItemProps {
	file: ImageFile;
	plan?: ResizePlan;
	busy: boolean;
	onRemove: (id: ImageFile['id']) => void;
	onDownload: (file: ImageFile) => void;
	onPreview: (url: string, name: string) => void;
}

const focusStyles =
	'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent-primary-hover)';

export const FileItem = ({ file, plan, busy, onRemove, onDownload, onPreview }: FileItemProps) => {
	const { t } = useTranslation('images');

	const { result } = file;

	const current = file.status === 'done' && !!result;
	const error = file.error ?? plan?.error;
	const hasOriginal = !!file.url && !!file.originalUrl;

	const status = error
		? t(($) => $.errors[error])
		: result && !current
			? t(($) => $.stale)
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

	const handlePreviewOriginal = () => {
		if (file.originalUrl) onPreview(file.originalUrl, file.file.name);
	};

	const handlePreviewResult = () => {
		if (result) onPreview(result.fullUrl, result.name);
	};

	return (
		<li className="flex min-w-0 items-center gap-3 rounded-xl bg-(--bg-tertiary)/70 p-3">
			{hasOriginal ? (
				<button
					className={cn(
						'flex size-12 shrink-0 cursor-zoom-in items-center justify-center overflow-hidden rounded-lg border border-(--border-color) bg-(--bg-secondary) transition-colors hover:border-(--accent-primary-hover)',
						focusStyles
					)}
					title={t(($) => $.original)}
					type="button"
					onClick={handlePreviewOriginal}
				>
					<img alt={t(($) => $.original)} className="size-full object-contain" src={file.url} />
				</button>
			) : (
				<div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-(--bg-secondary)">
					<Image className="size-6 text-(--color-disabled)" />
				</div>
			)}
			<div className="min-w-0 flex-1">
				<p className="truncate text-sm font-medium" title={file.file.name}>
					{file.file.name}
				</p>
				<div className="mb-0.5 flex h-4 flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-(--color-secondary)">
					<span className="trim">
						{file.format?.toUpperCase() ?? '–'}
						{file.width && file.height ? ` · ${file.width} × ${file.height}` : ''}
						{' · '}
						{formatFileSize(file.file.size)}
					</span>
					{result && (
						<>
							<MoveRight className="size-4" />
							<span className={cn('flex items-center gap-2', !current && 'opacity-50')}>
								<span className="trim">
									{result.format.toUpperCase()} · {result.width} × {result.height} ·{' '}
									{formatFileSize(result.blob.size)}
								</span>
								{result && (
									<span
										aria-label={sizeChangeLabel}
										className={cn(
											difference > 0 && 'text-(--status-error)/70',
											difference < 0 && 'text-(--status-success)'
										)}
										title={sizeChangeLabel}
									>
										{sizeChange}
									</span>
								)}
							</span>
						</>
					)}
				</div>
				<p
					className={cn(
						'trim mt-0.5 text-xs wrap-anywhere text-(--color-secondary)',
						error && 'text-(--status-error)'
					)}
				>
					{status}
				</p>
				{plan && !plan.error && !result && (
					<p className="text-xs text-(--color-secondary)">
						{t(($) => $.resize.planned, { width: plan.width, height: plan.height })}
					</p>
				)}
			</div>
			<div className="flex shrink-0 items-center gap-1">
				{current && (
					<>
						<Button
							aria-label={t(($) => $.result)}
							centerIcon={<Eye className="size-4" />}
							className="size-8 rounded-lg"
							disabled={busy}
							size="custom"
							title={t(($) => $.result)}
							onClick={handlePreviewResult}
						/>
						<Button
							aria-label={t(($) => $.download)}
							centerIcon={<Download className="size-4" />}
							className="size-8 rounded-lg"
							disabled={busy}
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
