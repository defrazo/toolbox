import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/inputs';

export const ScrollToTop = () => {
	const [visible, setVisible] = useState<boolean>(false);

	useEffect(() => {
		const onScroll = () => setVisible(window.scrollY > 300);
		window.addEventListener('scroll', onScroll, { passive: true });
		onScroll();
		return () => window.removeEventListener('scroll', onScroll);
	}, []);

	const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

	return (
		<Button
			centerIcon={<ArrowUp className="size-6" />}
			className={cn(
				'fixed right-8 bottom-4 z-50 hidden rounded-full p-3 shadow transition-all xl:block',
				visible ? 'opacity-100' : 'pointer-events-none opacity-0'
			)}
			size="custom"
			title="Наверх"
			onClick={scrollToTop}
		/>
	);
};
