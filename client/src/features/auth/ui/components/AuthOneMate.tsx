import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';

import { useStore } from '@/app/providers';
import { IconOneMate } from '@/shared/assets/icons';
import { Button } from '@/shared/ui';

export const AuthOneMate = observer(() => {
	const { t } = useTranslation('auth');

	const { authStore } = useStore();

	const handleLogin = () => window.location.assign('/auth/onemate');

	return (
		<Button
			className="h-10 w-full bg-(--bg-secondary) text-sm md:text-base"
			loading={authStore.isLoading}
			rightIcon={<IconOneMate className="mt-0.5 size-5.5" />}
			onClick={handleLogin}
		>
			{t(($) => $.common.social.onemate)}
		</Button>
	);
});
