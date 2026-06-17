import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import { useStore } from '@/app/providers';
import { IconMask } from '@/shared/assets/icons';
import { Button } from '@/shared/ui';

export const AuthDemo = observer(() => {
	const { t } = useTranslation('auth');
	const navigate = useNavigate();

	const { authStore, notifyStore } = useStore();

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
