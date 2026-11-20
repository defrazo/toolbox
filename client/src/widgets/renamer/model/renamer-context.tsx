import { createContext, type ReactNode, useContext } from 'react';

import { useRenamer } from './useRenamer';

const RenamerContext = createContext<ReturnType<typeof useRenamer> | null>(null);

interface RenamerProviderProps {
	children: ReactNode;
	onError: (message: string) => void;
}

export const RenamerProvider = ({ children, onError }: RenamerProviderProps) => {
	const renamer = useRenamer(onError);
	return <RenamerContext.Provider value={renamer}>{children}</RenamerContext.Provider>;
};

export const useRenamerContext = () => {
	const ctx = useContext(RenamerContext);
	if (!ctx) throw new Error('RenamerContext error');
	return ctx;
};
