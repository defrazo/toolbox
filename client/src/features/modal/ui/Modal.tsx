import type { ReactNode } from 'react';
import ReactDOM from 'react-dom';
import { X } from 'lucide-react';

import { useEscapeClose } from '../model';

export const Modal = ({ children, onClose }: { children: ReactNode; onClose?: () => void }) => {
	useEscapeClose(onClose);

	return ReactDOM.createPortal(
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-(--bg-overlay) p-4 backdrop-blur-[2px]"
			onClick={onClose}
		>
			<div
				className="core-border core-gap flex w-full max-w-md flex-col bg-(--bg-secondary) p-3 text-center backdrop-blur-md"
				onClick={(event) => event.stopPropagation()}
			>
				{onClose && (
					<div className="flex w-full justify-end">
						<X className="size-5 cursor-pointer hover:text-(--accent-hover)" onClick={onClose} />
					</div>
				)}
				{children}
			</div>
		</div>,
		document.body
	);
};
