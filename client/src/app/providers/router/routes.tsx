import type { RouteObject } from 'react-router';

import { Layout } from '@/app/layouts';
import { AuthSidebar } from '@/features/auth';
import { ForgotPassPage, LoginPage, RegisterPage, ResetPassPage, VerifyEmailPage } from '@/pages/auth';
import MainPage from '@/pages/main';
import NotFoundPage from '@/pages/not-found';
import { Sidebar } from '@/widgets/sidebar';

import { GuardedRoute, PublicRoute } from '.';

export const routes: RouteObject[] = [
	{
		element: <GuardedRoute />,
		children: [
			{
				element: <Layout hideLeftOnMobile leftSide={<Sidebar />} />,
				children: [{ path: '/', element: <MainPage /> }],
			},
		],
	},
	{
		element: <PublicRoute />,
		children: [
			{
				element: <Layout hideLeftOnMobile leftSide={<AuthSidebar />} />,
				children: [
					{ path: '/login', element: <LoginPage /> },
					{ path: '/register', element: <RegisterPage /> },
					{ path: '/forgot-password', element: <ForgotPassPage /> },
					{ path: '/reset-password/:token', element: <ResetPassPage /> },
					{ path: '/email/verify', element: <VerifyEmailPage /> },
				],
			},
		],
	},
	{
		path: '*',
		element: (
			<Layout>
				<NotFoundPage />
			</Layout>
		),
	},
];
