import { type ComponentType, type SVGProps, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { type LucideIcon, MessageCircleMore, QrCode } from 'lucide-react';

import { IconTG, IconVK } from '@/shared/assets/icons';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui';

import { share } from '../../../lib';
import { QrCodeBlock } from '.';

type ShareButton = {
	id: string;
	title: string;
	icon: ComponentType<SVGProps<SVGSVGElement>> | LucideIcon;
	action: () => void;
	style: string;
};

export const ShareBlock = ({ shortUrl }: { shortUrl: string }) => {
	const { t } = useTranslation('shortener');

	const [showQrCode, setShowQrCode] = useState(false);

	const shareButtons: ShareButton[] = [
		{
			id: 'vk',
			title: t(($) => $.share.vk),
			icon: IconVK,
			action: () => share('vk', shortUrl),
			style: 'hover:text-[#0077FF] hover:bg-[#0077FF]/10',
		},
		{
			id: 'tg',
			title: t(($) => $.share.telegram),
			icon: IconTG,
			action: () => share('tg', shortUrl),
			style: 'hover:text-[#229ED9] hover:bg-[#229ED9]/10',
		},
		{
			id: 'wa',
			title: t(($) => $.share.whatsapp),
			icon: MessageCircleMore,
			action: () => share('wa', shortUrl),
			style: 'hover:text-[#25D366] hover:bg-[#25D366]/10',
		},
		{
			id: 'qr',
			title: t(($) => $.share.qr),
			icon: QrCode,
			action: () => shortUrl && setShowQrCode((prev) => !prev),
			style: 'hover:text-[#6884ff] hover:bg-[#6884ff]/10',
		},
	];

	return (
		<div className="core-gap flex flex-col">
			<span className="leading-4 select-none">{t(($) => $.share.title)}</span>
			<div className="core-gap flex flex-col lg:flex-row">
				{shareButtons.map(({ id, title, icon: Icon, action, style }) => (
					<Button
						key={id}
						className={cn('flex-1 hover:shadow-(--shadow)', style)}
						disabled={!shortUrl}
						leftIcon={<Icon className="size-5" />}
						onClick={action}
					>
						{title}
					</Button>
				))}
			</div>
			{showQrCode && <QrCodeBlock value={shortUrl} />}
		</div>
	);
};
