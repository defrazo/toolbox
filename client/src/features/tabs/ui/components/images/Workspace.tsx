import { useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { useStore } from '@/app/providers';
import { ImageViewer } from '@/features/modal';
import { cn } from '@/shared/lib/utils';

import { type Mode, useDropzone, useImages } from '../../../model';
import { Controls } from './Controls';
import { FileArea, Toolbar } from './files';
import { Layout } from './Layout';
import { ModeTabs } from './ModeTabs';
import {
	CompressionInfo,
	CompressionSettings,
	ConverterInfo,
	ConverterSettings,
	ResizeControls,
	ResizeInfo,
	VectorControls,
	VectorInfo,
} from './settings';

interface WorkspaceProps {
	mode: Exclude<Mode, 'crop'>;
	onModeChange: (mode: Mode) => void;
}

const disabledStyles =
	'[&_button:disabled]:pointer-events-none [&_button:disabled]:translate-y-0 [&_button:disabled]:bg-(--bg-tertiary) [&_button:disabled]:bg-none [&_button:disabled]:text-(--color-secondary) [&_button:disabled]:opacity-100 [&_button:disabled]:shadow-none [&_input:disabled]:text-(--color-secondary) [&_input:disabled]:opacity-100';

export const Workspace = ({ mode, onModeChange }: WorkspaceProps) => {
	const { t } = useTranslation('images');
	const { notifyStore, modalStore } = useStore();

	const uploadRef = useRef<HTMLInputElement>(null);

	const {
		files,
		format,
		setFormat,
		quality,
		setQuality,
		vector,
		setVector,
		resize,
		resizePlans,
		setResizeSide,
		setResizeUnit,
		setResizePercent,
		setKeepAspect,
		busy,
		addFiles,
		processFiles,
		remove,
		clear,
		ready,
		download,
		downloadZip,
	} = useImages(
		(error) =>
			notifyStore.setNotice(
				t(($) => $.errors[error]),
				'error'
			),
		mode
	);

	const { isDropActive, dragProps } = useDropzone({ onDrop: (incoming) => void addFiles(incoming) });

	const preview = (url: string, name: string) => {
		modalStore.setModal(<ImageViewer alt={name} src={url} />);
	};

	const canProcess = files.some((file) => {
		if (!file.format || file.status === 'done') return false;
		if (mode !== 'resize') return true;

		const plan = resizePlans.get(file.id);
		return !!plan && !plan.error;
	});

	const renderModeContent = () => {
		switch (mode) {
			case 'converter':
				return {
					settings: <ConverterSettings busy={busy} format={format} setFormat={setFormat} />,
					info: <ConverterInfo format={format} />,
				};

			case 'compression':
				return {
					settings: <CompressionSettings busy={busy} quality={quality} setQuality={setQuality} />,
					info: <CompressionInfo />,
				};

			case 'resize':
				return {
					settings: (
						<ResizeControls
							busy={busy}
							resize={resize}
							setAspect={setKeepAspect}
							setPercent={setResizePercent}
							setSide={setResizeSide}
							setUnit={setResizeUnit}
						/>
					),
					info: <ResizeInfo resize={resize} />,
				};

			case 'vectorize':
				return {
					settings: <VectorControls busy={busy} setVector={setVector} vector={vector} />,
					info: <VectorInfo />,
				};
		}
	};

	const { settings, info } = renderModeContent();

	return (
		<Layout
			settings={
				<div className="flex min-h-0 min-w-0 flex-1 flex-col gap-3">
					<Toolbar busy={busy} mode={mode} uploadRef={uploadRef} onAddFiles={addFiles} />
					<div className={cn('flex min-h-0 min-w-0 flex-1 flex-col', disabledStyles)}>
						<Controls
							busy={busy}
							canProcess={canProcess}
							count={files.length}
							info={info}
							mode={mode}
							readyCount={ready.length}
							settings={settings}
							onClear={clear}
							onDownloadZip={downloadZip}
							onProcess={() => void processFiles()}
						/>
					</div>
				</div>
			}
			tabs={<ModeTabs hasWork={files.length > 0 || busy} mode={mode} onModeChange={onModeChange} />}
		>
			<FileArea
				busy={busy}
				dragProps={dragProps}
				files={files}
				isDropActive={isDropActive}
				mode={mode}
				resizePlans={resizePlans}
				uploadRef={uploadRef}
				onDownload={download}
				onPreview={preview}
				onRemove={remove}
			/>
		</Layout>
	);
};
