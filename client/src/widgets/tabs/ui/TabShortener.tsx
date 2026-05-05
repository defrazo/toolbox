import { useState } from 'react';
import { QRCode } from 'react-qr-code';
import { Copy, Link, MessageCircleMore, QrCode as QrIcon } from 'lucide-react';

import { IconTG, IconVK } from '@/shared/assets/icons';
import { useCopy } from '@/shared/lib/hooks';
import { cn } from '@/shared/lib/utils';
import { Button, Input } from '@/shared/ui';

import { shortenUrl } from '../api';
import { share } from '../lib';

export const TabShortener = () => {
	const copy = useCopy();

	const [url, setUrl] = useState('');
	const [shortUrl, setShortUrl] = useState('');
	const [showQrCode, setShowQrCode] = useState(false);

	const activeButton =
		'pointer-events-auto bg-linear-to-br from-[#5b5cff] via-[#7a5cff] to-[#4da3ff] font-medium text-white transition-all duration-200 ease-out hover:-translate-y-px hover:shadow-[0_6px_30px_rgba(91,92,255,0.45),0_0_25px_rgba(77,163,255,0.35)] active:translate-y-0';

	const socialButtons = [
		{
			title: 'ВКонтакте',
			icon: IconVK,
			action: () => share('vk', shortUrl),
			style: 'hover:text-[#0077FF] hover:bg-[#0077FF]/10',
		},
		{
			title: 'Telegram',
			icon: IconTG,
			action: () => share('tg', shortUrl),
			style: 'hover:text-[#229ED9] hover:bg-[#229ED9]/10',
		},
		{
			title: 'WhatsApp',
			icon: MessageCircleMore,
			action: () => share('wa', shortUrl),
			style: 'hover:text-[#25D366] hover:bg-[#25D366]/10',
		},
		{
			title: 'QR-код',
			icon: QrIcon,
			action: () => shortUrl && setShowQrCode((prev) => !prev),
			style: 'hover:text-[#6884ff] hover:bg-[#6884ff]/10',
		},
	];

	const handleShortener = async () => {
		const shortUrl = await shortenUrl(url);
		setShortUrl(shortUrl);
	};

	return (
		<div className="flex h-full flex-col gap-6">
			<div className="flex flex-col gap-4 rounded-2xl border border-(--border-color) bg-(--bg-secondary)/50 p-4">
				<div className="flex justify-between">
					<span className="leading-4">Длинная ссылка</span>
				</div>
				<div className="flex items-center justify-between gap-4">
					<Input
						className="h-14"
						leftIcon={<Link className="mx-2 size-4" />}
						placeholder="Введите ссылку, которую нужно сократить"
						value={url}
						onChange={(e) => setUrl(e.target.value)}
					/>
					<Button className={cn('h-14 min-w-40', shortUrl === '' && activeButton)} onClick={handleShortener}>
						Сократить
					</Button>
				</div>
			</div>
			<div className="flex">
				<div className="h-0.5 w-full bg-linear-to-l from-[#5b5cff]/50" />
				<div className="h-0.5 w-full bg-linear-to-r from-[#5b5cff]/50" />
			</div>
			<div className="flex flex-col gap-6 rounded-xl border border-(--border-color) bg-(--bg-secondary)/50 p-4">
				<div className="flex flex-col gap-4">
					<span className="leading-4">Ваша короткая ссылка</span>
					<div className="flex items-center justify-between gap-4">
						<Input className="h-14" leftIcon={<Link className="mx-2 size-4" />} readOnly value={shortUrl} />
						<Button
							className={cn('h-14 min-w-40', shortUrl !== '' && activeButton)}
							leftIcon={<Copy className="size-4" />}
							onClick={() => copy(shortUrl, 'Ссылка скопирована!')}
						>
							Скопировать
						</Button>
					</div>
				</div>
				<div className="flex flex-col gap-4">
					<span className="leading-4">Поделиться в</span>
					<div className="flex gap-4">
						{socialButtons.map(({ title, icon: Icon, action, style }) => {
							return (
								<Button
									className={cn('flex-1', style)}
									leftIcon={<Icon className="size-5" />}
									onClick={action}
								>
									{title}
								</Button>
							);
						})}
					</div>
					{showQrCode && shortUrl && (
						<div className="mx-auto flex w-fit flex-col items-center gap-2 rounded-xl bg-white p-2">
							<QRCode bgColor="transparent" fgColor="#000" size={128} value={shortUrl} />
						</div>
					)}
				</div>
			</div>
		</div>
	);
};
