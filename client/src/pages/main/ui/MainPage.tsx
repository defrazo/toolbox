import { useDeviceType } from '@/shared/lib/hooks';
import { MobileSidebar } from '@/widgets/sidebar';
import TabContainer from '@/widgets/tabs';

const MainPage = () => {
	const device = useDeviceType();

	return (
		<div className="relative flex min-h-0 flex-1 flex-col gap-4">
			{device === 'mobile' && <MobileSidebar />}
			<TabContainer />
		</div>
	);
};

export default MainPage;
