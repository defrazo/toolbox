import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import type { AuthStore } from '@/features/auth';
import type { NotifyStore } from '@/features/notification';
import { IconMask } from '@/shared/assets/icons';
import { Button } from '@/shared/ui';

interface AuthDemoProps {
	stores: { authStore: AuthStore; notifyStore: NotifyStore };
}

export const AuthDemo = observer(({ stores }: AuthDemoProps) => {
	const { t } = useTranslation('auth');
	const navigate = useNavigate();

	const { authStore, notifyStore } = stores;

	const handleDemo = async () => {
		try {
			await authStore.login('demo@example.com', 'DemoPassword123');

			navigate('/');
		} catch {
			notifyStore.setNotice(
				t(($) => $.errors.default),
				'error'
			);
		}
	};

	return (
		<Button
			className="h-10 w-full bg-(--bg-secondary) text-sm hover:opacity-100 md:text-base"
			loading={authStore.isLoading}
			rightIcon={<IconMask className="size-5" />}
			onClick={handleDemo}
		>
			{t(($) => $.screens.login.guest)}
		</Button>
	);
});
