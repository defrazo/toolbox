import { BrowserRouter } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { Toaster } from 'sonner';

import ModalManager from '@/features/modal';
import { useDeviceType } from '@/shared/lib/hooks';

import { I18nProvider, RouterProvider } from './providers';

const App = () => {
	const device = useDeviceType();

	return (
		<BrowserRouter>
			<I18nProvider>
				<RouterProvider />
				<ModalManager />
				<Toaster duration={5000} position={device === 'desktop' ? 'bottom-right' : 'top-left'} />
			</I18nProvider>
		</BrowserRouter>
	);
};

export default observer(App);
