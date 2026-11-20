import { lazy, Suspense, useState } from 'react';

import { Preloader } from '@/shared/ui';

import type { Mode } from '../model/types';
import type { ImagesServices } from '../model/types';
import { Layout, ModeTabs, Workspace } from './components';

const CropWorkspace = lazy(() => import('./crop'));

export const ImagesWidget = ({ services }: { services: ImagesServices }) => {
	const { tabsStore } = services;

	const [mode, setMode] = useState<Mode>(() => {
		const type = tabsStore.shortcut?.type;
		return type === 'crop' ? type : 'converter';
	});

	return mode === 'crop' ? (
		<Suspense
			fallback={
				<Layout tabs={<ModeTabs mode={mode} services={services} onModeChange={setMode} />}>
					<Preloader className="m-auto size-8" />
				</Layout>
			}
		>
			<CropWorkspace services={services} onModeChange={setMode} />
		</Suspense>
	) : (
		<Workspace key={mode} mode={mode} services={services} onModeChange={setMode} />
	);
};
