import { BrowserRouter } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { Toaster } from 'sonner';

import { useDeviceType } from '@/shared/lib/hooks';
import { ModalManager } from '@/shared/ui';

import { RouterProvider } from './providers';

const App = () => {
	const device = useDeviceType();

	return (
		<BrowserRouter>
			<RouterProvider />
			<ModalManager />
			<Toaster duration={5000} position={device === 'desktop' ? 'bottom-right' : 'top-left'} />
		</BrowserRouter>
	);
};

export default observer(App);
