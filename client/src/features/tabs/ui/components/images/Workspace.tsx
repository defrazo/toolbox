import { useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { useStore } from '@/app/providers';
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
} from './settings';

interface WorkspaceProps {
	mode: Exclude<Mode, 'crop'>;
	onModeChange: (mode: Mode) => void;
}

const disabledStyles =
	'[&_button:disabled]:pointer-events-none [&_button:disabled]:translate-y-0 [&_button:disabled]:bg-(--bg-tertiary) [&_button:disabled]:bg-none [&_button:disabled]:text-(--color-secondary) [&_button:disabled]:opacity-100 [&_button:disabled]:shadow-none [&_input:disabled]:text-(--color-secondary) [&_input:disabled]:opacity-100';

export const Workspace = ({ mode, onModeChange }: WorkspaceProps) => {
	const { t } = useTranslation('images');

	const { notifyStore } = useStore();

	const uploadRef = useRef<HTMLInputElement>(null);

	const {
		files,
		policy,
		limitsFor,
		format,
		setFormat,
		quality,
		setQuality,
		resize,
		resizePlans,
		setResizeSide,
		setResizeUnit,
		setResizePercent,
		setKeepAspect,
		busy,
		zipProgress,
		isProcessing,
		progress,
		preparationProgress,
		cancelProcessing,
		cancelPreparation,
		addFiles,
		processFiles,
		remove,
		clear,
		ready,
		download,
		downloadZip,
	} = useImages(
		(error, errorLimits) =>
			notifyStore.setNotice(
				t(($) => $.errors[error], {
					maxSide: errorLimits?.maxSide ?? policy.input.maxSide,
					megapixels:
						error === 'batchResolution'
							? limitsFor(undefined, 2).input.maxPixels / 1_000_000
							: (errorLimits?.maxPixels ?? policy.input.maxPixels) / 1_000_000,
				}),
				'error'
			),
		mode
	);

	const { isDropActive, dragProps } = useDropzone({ onDrop: (incoming) => void addFiles(incoming) });

	const handleDownload = () => {
		if (ready.length === 0) return;

		if (ready.length === 1) {
			download(ready[0]);
			return;
		}

		void downloadZip();
	};

	const canProcess = files.some((file) => file.status !== 'done' && file.status !== 'error');
	const settingsDisabled = busy || files.length === 0;

	const renderModeContent = () => {
		switch (mode) {
			case 'converter':
				return {
					settings: <ConverterSettings disabled={settingsDisabled} format={format} setFormat={setFormat} />,
					info: format === 'ico' ? <ConverterInfo format={format} /> : null,
				};

			case 'compression':
				return {
					settings: (
						<CompressionSettings disabled={settingsDisabled} quality={quality} setQuality={setQuality} />
					),
					info: <CompressionInfo />,
				};

			case 'resize':
				return {
					settings: (
						<ResizeControls
							disabled={settingsDisabled}
							resize={resize}
							setAspect={setKeepAspect}
							setPercent={setResizePercent}
							setSide={setResizeSide}
							setUnit={setResizeUnit}
						/>
					),
					info: <ResizeInfo resize={resize} />,
				};
		}
	};

	const { settings, info } = renderModeContent();

	return (
		<Layout
			settings={
				<>
					<div className={cn('flex min-h-0 min-w-0 flex-1 flex-col', disabledStyles)}>
						<Controls
							activeCount={files.filter((file) => file.status === 'processing').length}
							busy={busy}
							canProcess={canProcess}
							count={files.length}
							info={info}
							isProcessing={isProcessing}
							mode={mode}
							preparationProgress={preparationProgress}
							progress={progress}
							readyCount={ready.length}
							settings={settings}
							zipProgress={zipProgress}
							onCancel={cancelProcessing}
							onCancelPreparation={cancelPreparation}
							onClear={clear}
							onDownload={handleDownload}
							onProcess={() => void processFiles()}
						/>
					</div>
				</>
			}
			tabs={<ModeTabs hasWork={files.length > 0 || busy} mode={mode} onModeChange={onModeChange} />}
			toolbar={
				<Toolbar
					busy={busy}
					count={files.length}
					mode={mode}
					multiple
					uploadRef={uploadRef}
					onAddFiles={addFiles}
				/>
			}
		>
			<FileArea
				busy={busy}
				dragProps={dragProps}
				files={files}
				isDropActive={isDropActive}
				isProcessing={isProcessing}
				limitsFor={limitsFor}
				mode={mode}
				progress={progress}
				resizePlans={resizePlans}
				uploadRef={uploadRef}
				onDownload={download}
				onRemove={remove}
			/>
		</Layout>
	);
};
