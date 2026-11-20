import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';

import type { AuthStore } from '@/features/auth';
import { IconGoogle } from '@/shared/assets/icons';
import { Button } from '@/shared/ui';

export const AuthSocial = observer(({ stores }: { stores: { authStore: AuthStore } }) => {
	const { t } = useTranslation('auth');

	const { authStore } = stores;

	return (
		<Button
			className="h-10 w-full bg-(--bg-secondary) text-sm md:text-base"
			loading={authStore.isLoading}
			rightIcon={<IconGoogle className="size-5" />}
		>
			{t(($) => $.common.social.google)}
		</Button>
	);
});
