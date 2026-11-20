import { Navigate, Outlet } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import { useStore } from '../store';

export const PublicRoute = observer(() => {
	const { authStore } = useStore();

	if (authStore.isAuth) return <Navigate replace to="/" />;

	return <Outlet />;
});
