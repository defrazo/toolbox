import { lazy, Suspense, useState } from 'react';

import { Preloader } from '@/shared/ui';

import type { Mode } from '../model/types';
import type { ImagesStores } from '../model/types';
import { Layout, ModeTabs, Workspace } from './components';

const CropWorkspace = lazy(() => import('./crop'));

export const Images = ({ stores }: { stores: ImagesStores }) => {
	const { modalStore, tabsStore } = stores;

	const [mode, setMode] = useState<Mode>(() => {
		const type = tabsStore.shortcut?.type;
		return type === 'crop' ? type : 'converter';
	});

	return mode === 'crop' ? (
		<Suspense
			fallback={
				<Layout
					settings={<div className="min-h-0 min-w-0 flex-1" />}
					tabs={<ModeTabs mode={mode} stores={{ modalStore, tabsStore }} onModeChange={setMode} />}
					toolbar={<div className="core-border h-13 shrink-0 bg-(--bg-tertiary)/70" />}
				>
					<Preloader className="m-auto size-8" />
				</Layout>
			}
		>
			<CropWorkspace stores={stores} onModeChange={setMode} />
		</Suspense>
	) : (
		<Workspace key={mode} mode={mode} stores={stores} onModeChange={setMode} />
	);
};
