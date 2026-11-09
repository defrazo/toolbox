import { Children, type KeyboardEvent, type ReactNode, useEffect, useId, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { cn } from '@/shared/lib/utils';

import { Button } from '../../../inputs/button';

interface CarouselProps {
	title: string;
	children: ReactNode;
	slideClassName?: string;
}

export const Carousel = ({ title, children, slideClassName }: CarouselProps) => {
	const { t } = useTranslation('common');

	const headingId = useId();
	const viewportId = useId();

	const [viewportRef, api] = useEmblaCarousel({
		align: 'start',
		loop: true,
		slidesToScroll: 1,
		breakpoints: { '(prefers-reduced-motion: reduce)': { duration: 0 } },
	});

	const [navigation, setNavigation] = useState({ previous: false, next: false });

	const slides = Children.toArray(children);
	const jump = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	useEffect(() => {
		if (!api) return;

		const update = () => setNavigation({ previous: api.canScrollPrev(), next: api.canScrollNext() });
		update();

		api.on('select', update).on('reInit', update);
		const viewport = api.rootNode();

		let accumulated = 0;
		let lastEvent = 0;
		let lastScroll = -Infinity;

		const wheel = (event: WheelEvent) => {
			const delta = event.deltaX || (event.shiftKey ? event.deltaY : 0);
			if (event.ctrlKey || !delta || (!event.shiftKey && Math.abs(delta) <= Math.abs(event.deltaY))) return;
			if (!(delta > 0 ? api.canScrollNext() : api.canScrollPrev())) return;

			event.preventDefault();
			const now = performance.now();
			if (now - lastEvent > 180) accumulated = 0;

			lastEvent = now;
			accumulated += delta * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? viewport.clientWidth : 1);

			if (Math.abs(accumulated) < 30 || now - lastScroll < 180) return;
			if (accumulated > 0) api.scrollNext(jump());
			else api.scrollPrev(jump());

			lastScroll = now;
			accumulated = 0;
		};

		viewport.addEventListener('wheel', wheel, { passive: false });

		return () => {
			api.off('select', update).off('reInit', update);
			viewport.removeEventListener('wheel', wheel);
		};
	}, [api]);

	const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
		if (!api || event.altKey || event.ctrlKey || event.metaKey) return;

		if (event.key === 'ArrowRight') api.scrollNext(jump());
		else if (event.key === 'ArrowLeft') api.scrollPrev(jump());
		else if (event.key === 'Home') api.scrollTo(0, jump());
		else if (event.key === 'End') api.scrollTo(api.scrollSnapList().length - 1, jump());
		else return;

		event.preventDefault();
	};

	return (
		<section
			aria-labelledby={headingId}
			aria-roledescription={t(($) => $.carousel.region)}
			className="flex w-full min-w-0 flex-col gap-3 contain-[inline-size] select-none xl:gap-4"
		>
			<div className="flex min-w-0 items-center justify-between gap-3">
				<h2 className="text-lg font-semibold xl:text-2xl" id={headingId}>
					{title}
				</h2>
				{(navigation.previous || navigation.next) && (
					<div className="flex shrink-0 gap-1.5">
						<Button
							aria-controls={viewportId}
							aria-label={t(($) => $.carousel.previous)}
							centerIcon={<ChevronLeft className="size-4" />}
							className="size-8 rounded-lg p-0"
							disabled={!navigation.previous}
							size="custom"
							onClick={() => api?.scrollPrev(jump())}
						/>
						<Button
							aria-controls={viewportId}
							aria-label={t(($) => $.carousel.next)}
							centerIcon={<ChevronRight className="size-4" />}
							className="size-8 rounded-lg p-0"
							disabled={!navigation.next}
							size="custom"
							onClick={() => api?.scrollNext(jump())}
						/>
					</div>
				)}
			</div>
			<div
				ref={viewportRef}
				aria-label={title}
				className="min-w-0 overflow-hidden rounded-xl outline-offset-2 focus-visible:outline-2 focus-visible:outline-(--accent-primary-hover)"
				id={viewportId}
				tabIndex={0}
				onKeyDown={onKeyDown}
			>
				<div className="flex touch-pan-y touch-pinch-zoom items-stretch gap-4">
					{slides.map((slide, index) => (
						<div
							key={typeof slide === 'object' && slide && 'key' in slide ? slide.key : index}
							aria-label={t(($) => $.carousel.slide, { index: index + 1, count: slides.length })}
							aria-roledescription={t(($) => $.carousel.item)}
							className={cn(
								'flex max-w-96 min-w-0 shrink-0 grow-0 basis-[82%] sm:basis-[calc((100%-1rem)/2)] xl:basis-[calc((100%-2rem)/3)] 2xl:basis-[calc((100%-3rem)/4)]',
								slideClassName
							)}
							role="group"
						>
							{slide}
						</div>
					))}
				</div>
			</div>
		</section>
	);
};
