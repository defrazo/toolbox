import { useStore } from '@/app/providers';
import {
	AccountLinkPage,
	ForgotPassPage,
	LoginPage,
	RegisterPage,
	ResendEmailPage,
	ResetPassPage,
	VerifyEmailPage,
} from '@/pages/auth';

export const ForgotPassScreen = () => {
	const { authStore, notifyStore } = useStore();
	return <ForgotPassPage stores={{ authStore, notifyStore }} />;
};

export const ResetPassScreen = () => {
	const { authStore, notifyStore } = useStore();
	return <ResetPassPage stores={{ authStore, notifyStore }} />;
};

export const LoginScreen = () => {
	const { authStore, notifyStore } = useStore();
	return <LoginPage stores={{ authStore, notifyStore }} />;
};

export const RegisterScreen = () => {
	const { authStore, notifyStore } = useStore();
	return <RegisterPage stores={{ authStore, notifyStore }} />;
};

export const AccountLinkScreen = () => {
	const { authStore, notifyStore } = useStore();
	return <AccountLinkPage stores={{ authStore, notifyStore }} />;
};

export const VerifyEmailScreen = () => {
	const { authStore, userStore } = useStore();
	return <VerifyEmailPage stores={{ authStore, userStore }} />;
};

export const ResendEmailScreen = () => {
	const { authStore, notifyStore, userStore } = useStore();
	return <ResendEmailPage stores={{ authStore, notifyStore, userStore }} />;
};
