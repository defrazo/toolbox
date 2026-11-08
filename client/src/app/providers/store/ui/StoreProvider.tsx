import type { ReactNode } from 'react';

import { getRootStore } from '../model/rootStore';
import { StoreContext } from './StoreContext';

const StoreProvider = ({ children }: { children: ReactNode }) => {
	const rootStore = getRootStore();

	return <StoreContext.Provider value={rootStore}>{children}</StoreContext.Provider>;
};

export default StoreProvider;
