import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useCopy } from '@/shared/lib/hooks';

export const useLinksTable = () => {
	const { t } = useTranslation('links');
	const copy = useCopy();

	const [openQr, setOpenQr] = useState<string | null>(null);

	const qrContainerRef = useRef<HTMLDivElement>(null);
	const qrButtonRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

	const closeQr = () => setOpenQr(null);

	const toggleQr = (code: string) => setOpenQr((prev) => (prev === code ? null : code));

	const copyLink = (text: string) => {
		copy(
			text,
			t((t) => t.success.linkCopied)
		);
	};

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

	return { openQr, qrContainerRef, closeQr, setQrButtonRef, toggleQr, copyLink };
};
