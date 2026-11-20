import { useStore } from '@/app/providers';
import { Renamer } from '@/widgets/renamer';

export const RenamerScreen = () => {
	const { notifyStore, tabsStore } = useStore();
	return <Renamer stores={{ notifyStore, tabsStore }} />;
};
