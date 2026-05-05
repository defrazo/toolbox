import { Navigate, Outlet } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import { PreloaderExt } from '@/shared/ui';

import { useStore } from '../store';

export const PublicRoute = observer(() => {
	const { authStore } = useStore();

	if (authStore.isLoading) return <PreloaderExt />;
	if (authStore.isAuth) return <Navigate replace to="/" />;

	return <Outlet />;
});
