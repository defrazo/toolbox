import { type ChangeEvent, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Download, File, Plus, Trash2 } from 'lucide-react';

import { cn } from '@/shared/lib/utils';
import { Button, ClearInputButton, FileUploader, Input } from '@/shared/ui';

import { buildRenamedFiles, downloadAsZip } from '../lib';
import { RenamerProvider, useRenamerContext } from '../model';
import { FileArea } from './components/renamer';

export const TabRenamer = () => {
	return (
		<RenamerProvider>
			<TabRenamerContent />
		</RenamerProvider>
	);
};

const TabRenamerContent = () => {
	const { t } = useTranslation('renamer');

	const { files, prefix, setPrefix, suffix, setSuffix, preview, reset, handleIncomingFiles } = useRenamerContext();

	const uploadRef = useRef<HTMLInputElement>(null);

	const handleFiles = (e: ChangeEvent<HTMLInputElement>) => {
		if (!e.target.files) return;

		handleIncomingFiles(Array.from(e.target.files));
		e.target.value = '';
	};

	return (
		<>
			<div className="core-border flex flex-col bg-(--bg-tertiary)/70 shadow-(--shadow) md:flex-row">
				<FileUploader
					ref={uploadRef}
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
			<div className="core-gap flex min-h-0 flex-1 flex-col">
				<div className="core-border core-gap core-pad flex flex-col items-center justify-between bg-(--bg-secondary)/50 shadow-(--shadow) xl:flex-row">
					<span className="mr-auto text-lg select-none">{t(($) => $.rename.title)}:</span>
					<div className="relative flex w-full flex-1 flex-col items-center gap-2 md:flex-row">
						<Input
							className={cn('text-center', prefix === '' && 'pr-2')}
							placeholder={t(($) => $.rename.prefixPlaceholder)}
							rightIcon={<ClearInputButton hidden={prefix === ''} onClick={() => setPrefix('')} />}
							value={prefix}
							onChange={(e) => setPrefix(e.target.value)}
						/>
						<span className="hidden text-xl select-none md:block">№</span>
						<Input
							className={cn('text-center', suffix === '' && 'pr-2')}
							placeholder={t(($) => $.rename.suffixPlaceholder)}
							rightIcon={<ClearInputButton hidden={suffix === ''} onClick={() => setSuffix('')} />}
							value={suffix}
							onChange={(e) => setSuffix(e.target.value)}
						/>
					</div>
				</div>
				<FileArea uploadRef={uploadRef} />
				<div className="core-border core-pad core-gap flex flex-col items-center justify-between bg-(--bg-secondary)/50 shadow-(--shadow) lg:flex-row">
					<div className="hidden min-w-40 rounded-xl bg-(--accent-primary-dark) px-4 py-2 text-center text-sm text-(--color-accent) select-none lg:block">
						{t(($) => $.files.selectedFiles, { count: preview.length })}
					</div>
					<div className="core-gap flex w-full flex-col md:flex-row lg:w-1/2">
						<FileUploader
							className={cn('flex-1 bg-(--bg-tertiary)', files.length >= 1 && 'active-btn')}
							disabled={files.length === 0}
							icon={<Plus />}
							selectedFileName={t(($) => $.upload.addFiles)}
							onUpload={handleFiles}
						/>
						<Button
							className={cn('flex-1 hover:shadow-(--shadow)', files.length >= 1 && 'pointer-events-auto')}
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
