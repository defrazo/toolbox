import type { ReactNode } from 'react';
import ReactDOM from 'react-dom';
import { X } from 'lucide-react';

import { Button } from '@/shared/ui';

import { useEscapeClose } from '../model';

export const Modal = ({ children, onClose }: { children: ReactNode; onClose?: () => void }) => {
	useEscapeClose(onClose);

	return ReactDOM.createPortal(
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-(--bg-overlay) p-4 backdrop-blur-[2px]"
			onClick={onClose}
		>
			<div
				className="core-border flex max-w-md flex-col bg-(--bg-tertiary) p-3 text-center backdrop-blur-md"
				onClick={(event) => event.stopPropagation()}
			>
				<div className="top-4 flex h-4 w-full justify-between">
					{onClose && (
						<Button
							centerIcon={<X className="size-4.5" onClick={onClose} />}
							className="z-10 ml-auto p-0"
							type="button"
							variant="mobile"
						/>
					)}
				</div>
				{children}
			</div>
		</div>,
		document.body
	);
};
