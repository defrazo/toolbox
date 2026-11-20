import { useEffect, useRef, useState } from 'react';

export const useLinkQr = () => {
	const [openQr, setOpenQr] = useState<string | null>(null);

	const qrContainerRef = useRef<HTMLDivElement>(null);
	const qrButtonRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

	const closeQr = () => setOpenQr(null);

	const toggleQr = (code: string) => setOpenQr((prev) => (prev === code ? null : code));

	const setQrButtonRef = (code: string) => (element: HTMLButtonElement | null) => {
		if (element) qrButtonRefs.current.set(code, element);
		else qrButtonRefs.current.delete(code);
	};

	useEffect(() => {
		if (!openQr) return;

		const handleOutside = (event: PointerEvent) => {
			const target = event.target as Node;

			if (qrContainerRef.current?.contains(target)) return;

			const clickedOnButton = Array.from(qrButtonRefs.current.values()).some((button) => button.contains(target));
			if (clickedOnButton) return;

			setOpenQr(null);
		};

		document.addEventListener('pointerdown', handleOutside);

		return () => document.removeEventListener('pointerdown', handleOutside);
	}, [openQr, setOpenQr]);

	return { openQr, qrContainerRef, closeQr, setQrButtonRef, toggleQr };
};
