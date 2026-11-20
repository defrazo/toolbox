import { useStore } from '@/app/providers';
import { Shortener } from '@/widgets/shortener';

export const ShortenerScreen = () => {
	const { notifyStore, tabsStore } = useStore();
	return <Shortener stores={{ notifyStore, tabsStore }} />;
};
