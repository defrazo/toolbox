import { useStore } from '@/app/providers';
import { Links } from '@/widgets/links';

export const LinksScreen = () => {
	const { modalStore, notifyStore, userStore } = useStore();
	return <Links stores={{ modalStore, notifyStore, userStore }} />;
};
