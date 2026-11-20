import type { TFunction } from 'i18next';

import { createAuthChecks } from '../lib/createAuthChecks';

export const useAuth = (t: TFunction<'auth'>, notifyInfo: (message: string) => void) => {
	return createAuthChecks(t, notifyInfo);
};
