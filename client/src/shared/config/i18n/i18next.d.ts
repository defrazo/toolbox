import { defaultNS, resources } from './resources';

import 'i18next';

declare module 'i18next' {
	interface CustomTypeOptions {
		defaultNS: typeof defaultNS;
		resources: (typeof resources)['ru'];
		enableSelector: 'optimize';
	}
}
