import { BrowserRouter } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { Toaster } from 'sonner';

import { ModalManager } from '@/features/modal';
import { useDeviceType } from '@/shared/lib/hooks';

import { useStore } from './providers';
import I18nProvider from './providers/i18n';
import RouterProvider from './providers/router/RouterProvider';

const App = () => {
	const device = useDeviceType();

	const { modalStore } = useStore();

	return (
		<BrowserRouter>
			<I18nProvider>
				<RouterProvider />
				<ModalManager modalStore={modalStore} />
				<Toaster duration={5000} position={device === 'desktop' ? 'bottom-right' : 'top-left'} />
			</I18nProvider>
		</BrowserRouter>
	);
};

export default observer(App);
