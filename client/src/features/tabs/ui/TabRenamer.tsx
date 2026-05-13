import { useTranslation } from 'react-i18next';
import { Download, File, Plus, Trash2, X } from 'lucide-react';

import { cn } from '@/shared/lib/utils';
import { Button, FileUploader, Input } from '@/shared/ui';

import { buildRenamedFiles, downloadAsZip } from '../lib';
import { useRenamer } from '../model';

export const TabRenamer = () => {
	const { t } = useTranslation('renamer');

	const { files, setFiles, prefix, setPrefix, suffix, setSuffix, preview, reset } = useRenamer();

	const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!e.target.files) return;

		const newFiles = Array.from(e.target.files);

		setFiles((prev) => {
			const merged = [...prev, ...newFiles];
			return merged.slice(0, 100);
		});
	};

	const fileContainers = [
		{ title: t(($) => $.files.before), statusColor: 'bg-(--status-warning)', getName: (file: any) => file.oldName },
		{ title: t(($) => $.files.after), statusColor: 'bg-(--status-success)', getName: (file: any) => file.newName },
	];

	return (
		<>
			<div className="core-border flex bg-(--bg-tertiary)/70">
				<FileUploader
					className={cn('m-1 flex-1 rounded-lg', files.length === 0 && 'active-btn')}
					disabled={files.length !== 0}
					icon={<File />}
					id="renamer-upload"
					selectedFileName={t(($) => $.upload.uploadFiles)}
					onUpload={handleFiles}
				/>
				<Button
					className={cn(
						'm-1 flex-1 rounded-lg text-(--accent-primary-text) disabled:bg-transparent disabled:text-(--color-primary)',
						files.length >= 1 && 'active-btn'
					)}
					disabled={files.length === 0}
					leftIcon={<Download />}
					variant="custom"
					onClick={() => downloadAsZip(buildRenamedFiles(files, prefix, suffix))}
				>
					{t(($) => $.upload.download)}
				</Button>
			</div>
			<div className="flex min-h-0 flex-1 flex-col gap-4">
				<div className="core-border flex items-center justify-between gap-4 bg-(--bg-secondary)/50 p-4">
					<span className="text-lg select-none">{t(($) => $.rename.title)}:</span>
					<div className="relative flex flex-1 items-center gap-2">
						<Input
							className={cn('text-center', prefix === '' && 'pr-2')}
							placeholder={t(($) => $.rename.prefixPlaceholder)}
							rightIcon={
								<X
									className={cn(
										'size-8 cursor-pointer p-2 opacity-50 transition-transform hover:scale-125 hover:text-(--accent-secondary-hover) hover:opacity-100',
										prefix === '' && 'hidden'
									)}
									onClick={() => setPrefix('')}
								/>
							}
							value={prefix}
							onChange={(e) => setPrefix(e.target.value)}
						/>
						<span className="text-xl select-none">№</span>
						<Input
							className={cn('text-center', suffix === '' && 'pr-2')}
							placeholder={t(($) => $.rename.suffixPlaceholder)}
							rightIcon={
								<X
									className={cn(
										'size-8 cursor-pointer p-2 opacity-50 transition-transform hover:scale-125 hover:text-(--accent-secondary-hover) hover:opacity-100',
										suffix === '' && 'hidden'
									)}
									onClick={() => setSuffix('')}
								/>
							}
							value={suffix}
							onChange={(e) => setSuffix(e.target.value)}
						/>
					</div>
				</div>
				<div className="flex min-h-0 flex-1 justify-between gap-4" tabIndex={-1}>
					{fileContainers.map(({ title, statusColor, getName }) => (
						<div
							key={title}
							className="core-border flex min-h-0 max-w-88 flex-1 flex-col gap-4 bg-(--bg-secondary)/50 p-4"
						>
							<div className="flex items-center gap-2">
								<div className={cn('mt-0.5 size-3 rounded-full', statusColor)} />
								<span className="text-lg leading-4 select-none">{title}</span>
							</div>
							<div className="hide-scrollbar flex-1 overflow-y-auto rounded-lg bg-(--bg-tertiary)/70">
								{preview.map((file, idx) => (
									<div key={idx} className="border-b border-(--border-color) px-3 py-2">
										<span className="text-(--color-disabled)">№ {idx + 1}.</span>{' '}
										<span className="wrap-break-word">{getName(file)}</span>
									</div>
								))}
							</div>
						</div>
					))}
				</div>
				<div className="core-border flex items-center justify-between gap-2 bg-(--bg-secondary)/50 p-4">
					<div className="min-w-40 rounded-full bg-(--accent-primary-dark) px-4 py-2 text-center text-sm text-(--color-accent) select-none">
						{t(($) => $.files.selectedFiles, { count: preview.length })}
					</div>
					<div className="flex w-1/2 gap-2">
						<FileUploader
							className={cn('flex-1 bg-(--bg-tertiary)', files.length >= 1 && 'active-btn')}
							disabled={files.length === 0}
							icon={<Plus />}
							selectedFileName={t(($) => $.upload.addFiles)}
							onUpload={handleFiles}
						/>
						<Button
							className={cn('flex-1', files.length >= 1 && 'pointer-events-auto')}
							disabled={files.length === 0}
							leftIcon={<Trash2 />}
							onClick={reset}
						>
							{t(($) => $.upload.clear)}
						</Button>
					</div>
				</div>
			</div>
		</>
	);
};
