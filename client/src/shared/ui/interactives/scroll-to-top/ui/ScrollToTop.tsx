import { type RefObject, useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/inputs';

export const ScrollToTop = ({ scrollRef }: { scrollRef: RefObject<HTMLElement | null> }) => {
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		const element = scrollRef.current;
		if (!element) return;

		const onScroll = () => setVisible(element.scrollTop > 100);

		element.addEventListener('scroll', onScroll, { passive: true });
		onScroll();

		return () => element.removeEventListener('scroll', onScroll);
	}, []);

	const scrollToTop = () => scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });

	return (
		<Button
			centerIcon={<ArrowUp className="size-6" />}
			className={cn(
				'fixed right-12 bottom-12 z-50 hidden rounded-full p-3 shadow transition-all xl:block',
				visible ? 'opacity-100' : 'pointer-events-none opacity-0'
			)}
			size="custom"
			title="Наверх"
			onClick={scrollToTop}
		/>
	);
};
