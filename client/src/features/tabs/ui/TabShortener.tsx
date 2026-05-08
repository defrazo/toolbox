import { useEffect, useState } from 'react';
import { QRCode } from 'react-qr-code';
import { Copy, Link, MessageCircleMore, QrCode as QrIcon, X } from 'lucide-react';

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
		const result = await shortenUrl(url);
		setShortUrl(result);
	};
	useEffect(() => {
		const handler = (e: CustomEvent) => setUrl(e.detail);
		window.addEventListener('shortcut:paste-url', handler as EventListener);
		return () => window.removeEventListener('shortcut:paste-url', handler as EventListener);
	}, []);

	return (
		<>
			<div className="core-border flex flex-col gap-4 bg-(--bg-secondary)/50 p-4">
				<label className="w-fit leading-4 select-none" htmlFor="long-link">
					Длинная ссылка
				</label>
				<form
					className="flex items-center justify-between gap-4"
					onSubmit={(e) => {
						e.preventDefault();
						handleShortener();
					}}
				>
					<Input
						className="h-14"
						id="long-link"
						leftIcon={<Link className="mx-2 size-4" />}
						placeholder="Введите ссылку, которую нужно сократить"
						required
						rightIcon={
							<X
								className={cn(
									'size-8 cursor-pointer p-2 opacity-50 transition-transform hover:scale-125 hover:text-(--accent-secondary-hover) hover:opacity-100',
									url === '' && 'hidden'
								)}
								onClick={() => {
									setUrl('');
									setShortUrl('');
								}}
							/>
						}
						type="url"
						value={url}
						onChange={(e) => setUrl(e.target.value)}
					/>
					<Button
						className={cn('h-14 min-w-40', url && shortUrl === '' && 'active-btn')}
						disabled={!url}
						type="submit"
					>
						Сократить
					</Button>
				</form>
			</div>
			<div className="h-0.5 w-full animate-pulse bg-linear-to-r from-transparent via-(--accent-primary-hover) to-transparent" />
			<div className="core-border flex flex-col gap-6 bg-(--bg-secondary)/50 p-4">
				<div className="flex flex-col gap-4">
					<span className="w-fit leading-4 select-none">Ваша короткая ссылка</span>
					<div className="flex items-center justify-between gap-4">
						<Input
							className="h-14"
							disabled={!shortUrl}
							leftIcon={<Link className="mx-2 size-4" />}
							readOnly
							value={shortUrl}
						/>
						<Button
							className={cn('h-14 min-w-40', shortUrl !== '' && 'active-btn')}
							disabled={!shortUrl}
							leftIcon={<Copy className="size-4" />}
							onClick={() => copy(shortUrl, 'Ссылка скопирована!')}
						>
							Скопировать
						</Button>
					</div>
				</div>
				<div className="flex flex-col gap-4">
					<span className="leading-4 select-none">Поделиться в</span>
					<div className="flex gap-4">
						{socialButtons.map(({ title, icon: Icon, action, style }) => {
							return (
								<Button
									key={title}
									className={cn('flex-1', style)}
									disabled={!shortUrl}
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
		</>
	);
};
