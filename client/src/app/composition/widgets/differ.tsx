import { useStore } from '@/app/providers';
import { Differ } from '@/widgets/differ';

export const DifferScreen = () => {
	const { modalStore, notifyStore } = useStore();
	return <Differ stores={{ modalStore, notifyStore }} />;
};
