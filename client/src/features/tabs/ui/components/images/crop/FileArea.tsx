import type { RefObject } from 'react';
import { useTranslation } from 'react-i18next';
import { Upload } from 'lucide-react';

import { useDeviceType } from '@/shared/lib/hooks';
import { cn } from '@/shared/lib/utils';
import { Preloader } from '@/shared/ui';

import { formatFileSize } from '../../../../lib';
import type { useCrop } from '../../../../model';
import { Preview } from './Preview';

interface FileAreaProps {
	editor: ReturnType<typeof useCrop>;
	isDropActive: boolean;
	dragProps: Record<string, unknown>;
	uploadRef: RefObject<HTMLInputElement | null>;
}

export const FileArea = ({ editor, isDropActive, dragProps, uploadRef }: FileAreaProps) => {
	const { t } = useTranslation('images');
	const device = useDeviceType();

	const { source, loading, transform, selection, exporting, ratio, canvasRef, crop, zoom, setCrop } = editor;

	const isEmpty = !source;
	const showDropZone = isEmpty || isDropActive;

	return (
		<div
			{...dragProps}
			aria-busy={loading || exporting}
			className={cn(
				'group relative flex min-h-[190px] min-w-0 flex-1 flex-col rounded-xl transition-all duration-200',
				showDropZone && 'border border-dashed border-(--accent-primary-hover)/50',
				!isEmpty && 'gap-3',
				isDropActive && 'border-(--accent-primary-hover)'
			)}
		>
			{isEmpty && device !== 'mobile' ? (
				<button
					className={cn(
						'flex min-h-[190px] w-full flex-1 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg bg-(--bg-secondary)/50 px-3 text-center text-(--color-accent) transition-colors duration-200 hover:bg-(--accent-primary-hover)/10 focus-visible:outline focus-visible:outline-(--accent-primary-hover) disabled:pointer-events-none disabled:cursor-default disabled:opacity-60',
						isDropActive && 'bg-(--accent-primary-hover)/10'
					)}
					disabled={loading}
					type="button"
					onClick={() => uploadRef.current?.click()}
				>
					{loading ? (
						<Preloader className="size-8" />
					) : (
						<Upload className={cn('size-14', isDropActive && 'animate-pulse')} />
					)}
					<div className="flex flex-col items-center gap-0.5 text-lg font-medium">
						<span className={cn(isDropActive && 'animate-pulse')}>
							{loading ? t(($) => $.status.loading) : t(($) => $.crop.drop)}
						</span>
						<span className="text-sm font-normal text-(--color-tertiary)">JPG · PNG · WebP · AVIF</span>
						<span className="text-sm font-normal text-(--color-tertiary)">{t(($) => $.crop.limits)}</span>
					</div>
				</button>
			) : (
				<>
					{source && (
						<>
							<Preview
								aspect={ratio}
								canvasRef={canvasRef}
								crop={crop}
								disabled={exporting}
								image={source.image}
								transform={transform}
								zoom={zoom}
								onChange={setCrop}
							/>
							<div className="core-border hidden w-full min-w-0 shrink-0 flex-col gap-2 bg-(--bg-secondary)/70 p-2 sm:flex-row sm:items-center xl:flex">
								<div className="min-w-0 flex-1 text-sm" title={source.name}>
									<span className="block truncate">{source.name}</span>
									<span className="block text-xs wrap-anywhere text-(--color-secondary)">
										{source.format.toUpperCase()} · {source.image.naturalWidth} ×{' '}
										{source.image.naturalHeight} · {formatFileSize(source.bytes)}
									</span>
								</div>
								<span
									className="hidden shrink-0 text-sm text-(--color-secondary) xl:block"
									role="status"
								>
									{t(($) => $.crop.selection)}: {Math.max(1, Math.round(selection.width))} ×{' '}
									{Math.max(1, Math.round(selection.height))} px
								</span>
							</div>
						</>
					)}
				</>
			)}
		</div>
	);
};
