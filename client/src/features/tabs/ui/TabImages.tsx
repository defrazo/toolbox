import { lazy, Suspense, useState } from 'react';

import { Preloader } from '@/shared/ui';

import type { Mode, TabLayoutProps } from '../model';
import { Layout, ModeTabs, Workspace } from './components/images';

const CropWorkspace = lazy(() => import('./components/images/crop/Workspace'));

export const TabImages = (_props: TabLayoutProps) => {
	const [mode, setMode] = useState<Mode>('converter');

	return mode === 'crop' ? (
		<Suspense
			fallback={
				<Layout tabs={<ModeTabs mode={mode} onModeChange={setMode} />}>
					<Preloader className="mx-auto size-8" />
				</Layout>
			}
		>
			<CropWorkspace onModeChange={setMode} />
		</Suspense>
	) : (
		<Workspace key={mode} mode={mode} onModeChange={setMode} />
	);
};
