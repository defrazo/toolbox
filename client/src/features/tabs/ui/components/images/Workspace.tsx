import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useStore } from '@/app/providers';
import { ImageViewer } from '@/features/modal';
import { cn } from '@/shared/lib/utils';

import { type BackgroundSettings, type Mode, useDropzone, useImages } from '../../../model';
import { Controls } from './Controls';
import { FileArea, Toolbar } from './files';
import { Layout } from './Layout';
import { ModeTabs } from './ModeTabs';
import {
	BackgroundControls,
	BackgroundInfo,
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

	const { notifyStore, modalStore } = useStore();

	const [pickingEnabled, setPickingEnabled] = useState(false);
	const [zoom, setZoom] = useState(100);
	const [sampleColor, setSampleColor] = useState<{ id: string; x: number; y: number; hex: string } | null>(null);

	const uploadRef = useRef<HTMLInputElement>(null);

	const {
		files,
		format,
		setFormat,
		quality,
		setQuality,
		activeBackgroundFile,
		selectBackgroundFile,
		setBackground,
		setBackgroundSample,
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

	const picking = pickingEnabled && files.length > 0;
	const color =
		sampleColor?.id === activeBackgroundFile?.id &&
		sampleColor?.x === activeBackgroundFile?.background?.sample.x &&
		sampleColor?.y === activeBackgroundFile?.background?.sample.y
			? (sampleColor?.hex ?? null)
			: null;

	const onSampleColor = useCallback((id: string, sample: BackgroundSettings['sample'], hex: string) => {
		setSampleColor((previous) =>
			previous?.id === id && previous.x === sample.x && previous.y === sample.y && previous.hex === hex
				? previous
				: { id, ...sample, hex }
		);
	}, []);

	useEffect(() => {
		if (files.length === 0) setPickingEnabled(false);
	}, [files.length]);

	useLayoutEffect(() => {
		setZoom(100);
	}, [activeBackgroundFile?.id]);

	useEffect(() => {
		if (!picking) return;

		const cancel = (event: KeyboardEvent) => {
			if (event.key !== 'Escape') return;

			event.preventDefault();
			setPickingEnabled(false);
		};
		document.addEventListener('keydown', cancel);

		return () => document.removeEventListener('keydown', cancel);
	}, [picking]);

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

	const settingsDisabled = busy || !files.some((file) => !!file.format);

	const renderModeContent = () => {
		switch (mode) {
			case 'converter':
				return {
					settings: <ConverterSettings disabled={settingsDisabled} format={format} setFormat={setFormat} />,
					info: <ConverterInfo format={format} />,
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

			case 'background':
				return {
					settings: (
						<BackgroundControls
							busy={busy}
							color={color}
							file={activeBackgroundFile}
							format={format}
							picking={picking}
							setBackground={setBackground}
							setFormat={setFormat}
							zoom={zoom}
							onPick={() => setPickingEnabled((enabled) => !enabled)}
							onZoomChange={(value) => {
								if (Number.isFinite(value)) setZoom(Math.min(400, Math.max(25, value)));
							}}
						/>
					),
					info: <BackgroundInfo />,
				};
		}
	};

	const { settings, info } = renderModeContent();

	return (
		<Layout
			settings={
				<>
					<Toolbar busy={busy} mode={mode} uploadRef={uploadRef} onAddFiles={addFiles} />
					<div
						className={cn(
							'flex min-h-0 min-w-0 flex-1 scrollbar-none flex-col overflow-y-auto',
							disabledStyles
						)}
					>
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
				</>
			}
			tabs={<ModeTabs hasWork={files.length > 0 || busy} mode={mode} onModeChange={onModeChange} />}
		>
			<FileArea
				activeFile={activeBackgroundFile}
				busy={busy}
				dragProps={dragProps}
				files={files}
				isDropActive={isDropActive}
				mode={mode}
				picking={picking}
				resizePlans={resizePlans}
				uploadRef={uploadRef}
				zoom={zoom}
				onBackgroundSample={setBackgroundSample}
				onDownload={download}
				onPreview={preview}
				onRemove={remove}
				onSampleColor={onSampleColor}
				onSelect={selectBackgroundFile}
			/>
		</Layout>
	);
};
