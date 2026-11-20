import { useStore } from '@/app/providers';
import { Images } from '@/widgets/images';

export const ImagesScreen = () => {
	const { modalStore, notifyStore, tabsStore } = useStore();
	return <Images stores={{ modalStore, notifyStore, tabsStore }} />;
};
