import { Download, File as FileIcon, Plus, Trash2, X } from 'lucide-react';

import { cn } from '@/shared/lib/utils';
import { Button, FileUploader, Input } from '@/shared/ui';

import { downloadAsZip, plural } from '../lib';
import { useRenamer } from '../model';

export const TabRenamer = () => {
	const { files, setFiles, prefix, setPrefix, suffix, setSuffix, preview, clearName, reset } = useRenamer();

	const fileContainers = [
		{ title: 'До', statusColor: 'bg-(--status-warning)', getName: (file: any) => file.oldName },
		{ title: 'После', statusColor: 'bg-(--status-success)', getName: (file: any) => file.newName },
	];

	const activeButton =
		'pointer-events-auto bg-linear-to-br from-[#5b5cff] via-[#7a5cff] to-[#4da3ff] font-medium text-white transition-all duration-200 ease-out hover:-translate-y-px hover:shadow-[0_6px_30px_rgba(91,92,255,0.45),0_0_25px_rgba(77,163,255,0.35)] active:translate-y-0';

	const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!e.target.files) return;

		const newFiles = Array.from(e.target.files);

		setFiles((prev) => {
			const merged = [...prev, ...newFiles];

			return merged.slice(0, 50);
		});
	};

	const buildRenamedFiles = () => {
		return files.map((file, index) => {
			const idx = String(index + 1).padStart(2, '0');

			const ext = file.name.split('.').pop();
			const newName = `${prefix}${idx}${suffix}.${ext}`;

			return new File([file], newName, { type: file.type });
		});
	};

	return (
		<div className="flex min-h-0 flex-1 flex-col gap-8">
			<div className="pointer-events-none flex rounded-2xl border border-(--border-color) bg-(--bg-tertiary)/70">
				<FileUploader
					className={cn('m-1 flex-1 rounded-xl', files.length === 0 && activeButton)}
					icon={<FileIcon />}
					onUpload={handleFiles}
				/>
				<Button
					className={cn('pointer-events-none m-1 flex-1 rounded-xl', files.length >= 1 && activeButton)}
					leftIcon={<Download />}
					variant="custom"
					onClick={() => downloadAsZip(buildRenamedFiles())}
				>
					Скачать
				</Button>
			</div>
			<div className="flex h-full flex-col gap-4">
				<div className="flex items-center justify-between gap-2 rounded-2xl border border-(--border-color) bg-(--bg-secondary)/50 p-4">
					<span className="text-lg">Новое название</span>
					<div className="relative flex flex-1 items-center gap-0.5 rounded-2xl bg-(--bg-tertiary) ring-(--accent-primary-hover) ring-inset hover:ring-1 focus:ring-1">
						<Input
							className="flex-1 pr-0 pl-2 text-right"
							value={prefix}
							variant="custom"
							onChange={(e) => setPrefix(e.target.value)}
						/>
						<span className="text-xl text-(--color-disabled) select-none">№</span>
						<Input
							className="flex-1 pr-2 pl-0"
							value={suffix}
							variant="custom"
							onChange={(e) => setSuffix(e.target.value)}
						/>
						<X
							className={cn(
								'absolute right-0 z-50 size-8 cursor-pointer bg-transparent p-2 opacity-50 hover:scale-125 hover:text-(--accent-secondary-hover) hover:opacity-100',
								prefix === '' && suffix === '' && 'hidden'
							)}
							onClick={clearName}
						/>
					</div>
				</div>
				<div className="flex h-full max-h-[60dvh] flex-1 justify-between gap-4">
					{fileContainers.map(({ title, statusColor, getName }) => (
						<div
							key={title}
							className="flex min-h-0 flex-1 flex-col gap-4 rounded-2xl border border-(--border-color) bg-(--bg-secondary)/50 p-4"
						>
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<div className={cn('mt-0.5 size-3 rounded-full', statusColor)} />
									<h4 className="text-lg leading-4">{title}</h4>
								</div>
							</div>
							<div className="hide-scrollbar flex-1 overflow-y-auto rounded-xl bg-(--bg-tertiary)">
								{preview.map((file, idx) => (
									<div key={idx} className="border-b border-(--border-color) p-2">
										{getName(file)}
									</div>
								))}
							</div>
						</div>
					))}
				</div>
				<div className="flex items-center justify-between gap-2 rounded-2xl border border-(--border-color) bg-(--bg-secondary)/50 p-4">
					<div className="min-w-40 rounded-full bg-linear-to-br from-[#5b5cff]/20 via-[#7a5cff]/20 to-[#4da3ff]/20 px-4 py-2 text-center text-sm text-[#6884ff]">
						{plural(preview.length, 'Выбран', 'Выбрано', 'Выбрано')} {preview.length}{' '}
						{plural(preview.length, 'файл', 'файла', 'файлов')}
					</div>
					<div className="flex w-1/2 gap-2">
						<FileUploader
							className={cn(
								'pointer-events-none flex-1 rounded-xl bg-(--bg-tertiary)',
								files.length >= 1 && activeButton
							)}
							icon={<Plus />}
							selectedFileName="Добавить файлы"
							onUpload={handleFiles}
						/>
						<Button
							className={cn('pointer-events-none flex-1', files.length >= 1 && 'pointer-events-auto')}
							leftIcon={<Trash2 />}
							onClick={reset}
						>
							Очистить
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};
