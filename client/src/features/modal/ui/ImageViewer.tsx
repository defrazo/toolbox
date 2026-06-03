import { observer } from 'mobx-react-lite';

import { useStore } from '@/app/providers';

import { useEscapeClose } from '../model';

export const ImageViewer = observer(({ src, alt }: { src: string; alt?: string }) => {
	const { modalStore } = useStore();

	useEscapeClose(() => modalStore.closeModal());

	return (
		<div
			className="fixed inset-0 z-1000 flex cursor-zoom-out items-center justify-center bg-(--bg-overlay)"
			onClick={() => modalStore.closeModal()}
		>
			<img
				alt={alt ?? 'Zoomed image'}
				className="no-touch-callout max-h-[90vh] max-w-[90vw] rounded-lg object-contain"
				decoding="async"
				loading="lazy"
				src={src}
				onClick={() => modalStore.closeModal()}
			/>
		</div>
	);
});
