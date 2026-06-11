import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { QRCode } from 'react-qr-code';
import { Download } from 'lucide-react';

import { Button } from '@/shared/ui';

export const QrCodeBlock = ({ value, onDownloaded }: { value: string; onDownloaded?: () => void }) => {
	const { t } = useTranslation('shortener');

	const containerRef = useRef<HTMLDivElement>(null);

	const handleDownload = () => {
		const svg = containerRef.current?.querySelector('svg');
		if (!svg) return;

		const serialized = new XMLSerializer().serializeToString(svg);
		const blob = new Blob([serialized], { type: 'image/svg+xml' });
		const url = URL.createObjectURL(blob);

		const canvas = document.createElement('canvas');
		const size = 512;
		canvas.width = size;
		canvas.height = size;

		const img = new Image();
		img.onload = () => {
			const ctx = canvas.getContext('2d')!;
			ctx.fillStyle = '#ffffff';
			ctx.fillRect(0, 0, size, size);
			ctx.drawImage(img, 0, 0, size, size);
			URL.revokeObjectURL(url);

			const a = document.createElement('a');
			a.download = 'qrcode.png';
			a.href = canvas.toDataURL('image/png');
			a.click();

			onDownloaded?.();
		};
		img.src = url;
	};

	return (
		<div className="mx-auto flex flex-col items-center gap-2">
			<div ref={containerRef} className="rounded-xl bg-white p-2">
				<QRCode bgColor="transparent" fgColor="#000" size={112} value={value} />
			</div>
			<Button
				className="w-32"
				leftIcon={<Download className="size-4" />}
				size="sm"
				variant="ghost"
				onClick={handleDownload}
			>
				{t(($) => $.share.downloadQr)}
			</Button>
		</div>
	);
};
