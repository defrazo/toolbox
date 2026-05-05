import { useNavigate } from 'react-router-dom';

import { useStore } from '@/app/providers';
import { IconGoogle, IconMask } from '@/shared/assets/icons';
import { Button } from '@/shared/ui';

interface AuthSocialProps {
	type: 'login' | 'register';
}

export const AuthSocial = ({ type }: AuthSocialProps) => {
	const { authStore, notifyStore } = useStore();
	const navigate = useNavigate();

	const handleDemo = async () => {
		try {
			await authStore.login('test@test.com', '12345678');
			navigate('/');
		} catch (error: any) {
			notifyStore.setNotice(error?.response?.data?.message || 'Ошибка входа', 'error');
		}
	};

	return (
		<>
			<Button
				className="h-10 w-full text-sm hover:text-(--accent-text) md:text-base"
				rightIcon={<IconGoogle className="size-5" />}
				title="Доступно только для разработчика"
			>
				Продолжить с аккаунтом Google
			</Button>
			{type === 'login' && (
				<Button
					className="h-10 w-full text-sm hover:text-(--accent-text) hover:opacity-100 md:text-base"
					rightIcon={<IconMask className="size-5" />}
					onClick={handleDemo}
				>
					Войти как гость
				</Button>
			)}
		</>
	);
};
