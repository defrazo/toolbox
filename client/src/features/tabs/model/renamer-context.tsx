import { createContext, type ReactNode, useContext } from 'react';

import { useRenamer } from '.';

const RenamerContext = createContext<ReturnType<typeof useRenamer> | null>(null);

export const RenamerProvider = ({ children }: { children: ReactNode }) => {
	const renamer = useRenamer();
	return <RenamerContext.Provider value={renamer}>{children}</RenamerContext.Provider>;
};

export const useRenamerContext = () => {
	const ctx = useContext(RenamerContext);
	if (!ctx) throw new Error('RenamerContext error');
	return ctx;
};
