import type { RouteObject } from 'react-router-dom';

import {
	AccountLinkScreen,
	ForgotPassScreen,
	LoginScreen,
	RegisterScreen,
	ResendEmailScreen,
	ResetPassScreen,
	VerifyEmailScreen,
} from '@/app/composition/pages/auth';
import { MainScreen } from '@/app/composition/pages/main';
import { ToolboxSidebar } from '@/app/composition/widgets/sidebar';
import { Layout } from '@/app/layouts';
import { AuthSidebar } from '@/features/auth';
import NotFoundPage from '@/pages/not-found';
import PrivacyPolicyPage from '@/pages/privacy-policy';

import { GuardedRoute } from './GuardedRoute';
import { PublicRoute } from './PublicRoute';

export const routes: RouteObject[] = [
	{
		element: <GuardedRoute />,
		children: [
			{
				element: <Layout hideLeftOnMobile leftSide={<ToolboxSidebar />} />,
				children: [{ path: '/', element: <MainScreen /> }],
			},
		],
	},
	{
		element: <PublicRoute />,
		children: [
			{
				element: <Layout hideLeftOnMobile leftSide={<AuthSidebar />} variant="auth" />,
				children: [
					{ path: '/login', element: <LoginScreen /> },
					{ path: '/register', element: <RegisterScreen /> },
					{ path: '/account-link', element: <AccountLinkScreen /> },
					{ path: '/forgot-password', element: <ForgotPassScreen /> },
					{ path: '/reset-password', element: <ResetPassScreen /> },
				],
			},
		],
	},
	{
		element: <Layout hideLeftOnMobile leftSide={<AuthSidebar />} />,
		children: [{ path: '/email/verify/:id/:hash', element: <VerifyEmailScreen /> }],
	},
	{
		element: <Layout hideLeftOnMobile leftSide={<AuthSidebar />} />,
		children: [{ path: '/email/verify', element: <ResendEmailScreen /> }],
	},
	{
		path: '/privacy',
		element: <PrivacyPolicyPage />,
	},
	{
		path: '*',
		element: <NotFoundPage />,
	},
];
