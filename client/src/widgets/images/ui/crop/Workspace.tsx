import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Download, Trash2 } from 'lucide-react';

import { useShortcutUpload } from '@/features/tabs';
import { useDropzone } from '@/shared/lib/hooks';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui';

import { imagePolicy } from '../../model/imagePolicy';
import type { ImagesStores, Mode } from '../../model/types';
import { useCrop } from '../../model/useCrop';
import { Layout } from '../components/Layout';
import { ModeTabs } from '../components/ModeTabs';
import { CropSettings } from './CropSettings';
import { FileArea } from './FileArea';
import { Toolbar } from './Toolbar';

const disabledStyles =
	'[&_button:disabled]:pointer-events-none [&_button:disabled]:translate-y-0 [&_button:disabled]:bg-(--bg-tertiary) [&_button:disabled]:bg-none [&_button:disabled]:text-(--color-secondary) [&_button:disabled]:opacity-100 [&_button:disabled]:shadow-none [&_input:disabled]:text-(--color-secondary) [&_input:disabled]:opacity-100';

interface CropWorkspaceProps {
	onModeChange: (mode: Mode) => void;
	stores: ImagesStores;
}

const Workspace = ({ onModeChange, stores }: CropWorkspaceProps) => {
	const { t } = useTranslation('images');

	const { modalStore, notifyStore, tabsStore } = stores;

	const uploadRef = useRef<HTMLInputElement>(null);

	const editor = useCrop((error, limits) =>
		notifyStore.setNotice(
			t(($) => $.crop.errors[error], {
				megapixels: (limits ?? imagePolicy({ mode: 'crop' }).input).maxPixels / 1_000_000,
				maxSide: (limits ?? imagePolicy({ mode: 'crop' }).input).maxSide,
			}),
			'error'
		)
	);

	useShortcutUpload(tabsStore, 'crop', uploadRef, !editor.loading);

	const { isDropActive, dragProps } = useDropzone({ onDrop: editor.addFiles });

	return (
		<Layout
			settings={
				<div className="flex min-h-0 min-w-0 flex-1 flex-col gap-3">
					<div
						className={cn(
							'core-border flex min-h-0 min-w-0 flex-1 flex-col bg-(--bg-secondary)/70 p-3',
							disabledStyles
						)}
					>
						<CropSettings editor={editor} />
						<div className="mt-3 flex flex-col gap-3 border-t border-(--border-color) pt-3">
							<Button
								className="h-10 rounded-lg"
								disabled={!editor.result || editor.exporting}
								leftIcon={<Download className="size-4" />}
								onClick={editor.download}
							>
								{t(($) => $.download)}
							</Button>
							<Button
								className="h-8 w-full rounded-lg"
								disabled={!editor.hasWork}
								leftIcon={<Trash2 className="size-4" />}
								size="sm"
								onClick={editor.clear}
							>
								{t(($) => $.clear)}
							</Button>
						</div>
					</div>
				</div>
			}
			tabs={
				<ModeTabs
					hasWork={editor.hasWork}
					mode="crop"
					stores={{ modalStore, tabsStore }}
					onModeChange={onModeChange}
				/>
			}
			toolbar={<Toolbar busy={editor.loading} uploadRef={uploadRef} onAddFiles={editor.addFiles} />}
		>
			<FileArea dragProps={dragProps} editor={editor} isDropActive={isDropActive} uploadRef={uploadRef} />
		</Layout>
	);
};

export default Workspace;
