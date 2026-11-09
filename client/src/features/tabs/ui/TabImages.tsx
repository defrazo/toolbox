import { lazy, Suspense, useState } from 'react';

import { useStore } from '@/app/providers';
import { Preloader } from '@/shared/ui';

import type { Mode, TabLayoutProps } from '../model';
import { Layout, ModeTabs, Workspace } from './components/images';

const CropWorkspace = lazy(() => import('./components/images/crop/Workspace'));

export const TabImages = (_props: TabLayoutProps) => {
	const { tabsStore } = useStore();

	const [mode, setMode] = useState<Mode>(() => {
		const type = tabsStore.shortcut?.type;
		return type === 'background' || type === 'crop' ? type : 'converter';
	});

	return mode === 'crop' ? (
		<Suspense
			fallback={
				<Layout tabs={<ModeTabs mode={mode} onModeChange={setMode} />}>
					<Preloader className="m-auto size-8" />
				</Layout>
			}
		>
			<CropWorkspace onModeChange={setMode} />
		</Suspense>
	) : (
		<Workspace key={mode} mode={mode} onModeChange={setMode} />
	);
};
