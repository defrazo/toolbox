import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'lucide-react';
import { reaction } from 'mobx';

import { shortLinksApi } from '@/entities/short-link';
import type { TabsStore } from '@/features/tabs';
import { cn } from '@/shared/lib/utils';
import { Button, ClearInputButton, Input } from '@/shared/ui';

import { ResultBlock } from './components';

interface ShortenerWidgetProps {
	navigation: Pick<TabsStore, 'shortcut' | 'consumeShortcut'>;
	onOpenLinks: () => void;
	onNotice: (message: string, type: 'success' | 'error') => void;
}

export const ShortenerWidget = ({ navigation, onOpenLinks, onNotice }: ShortenerWidgetProps) => {
	const { t } = useTranslation('shortener');

	const [isLoading, setIsLoading] = useState(false);
	const [url, setUrl] = useState('');
	const [shortUrl, setShortUrl] = useState('');

	const handleShortener = async () => {
		if (!url.trim()) return;

		setIsLoading(true);

		try {
			const link = await shortLinksApi.createLink(url);
			setShortUrl(link.shortUrl);
		} catch {
			onNotice(
				t(($) => $.result.error),
				'error'
			);
		} finally {
			setIsLoading(false);
		}
	};

	const clearUrl = () => {
		setUrl('');
		setShortUrl('');
	};

	useEffect(
		() =>
			reaction(
				() => navigation.shortcut,
				(request) => {
					if (
						request?.type !== 'paste-url' ||
						typeof request.payload !== 'string' ||
						!navigation.consumeShortcut(request.id)
					)
						return;
					setUrl(request.payload);
					setShortUrl('');
				},
				{ fireImmediately: true }
			),
		[navigation]
	);

	return (
		<>
			<div className="core-border core-pad core-gap flex flex-col bg-(--bg-secondary)/50 shadow-(--shadow)">
				<label className="w-fit leading-4 select-none" htmlFor="long-link">
					{t(($) => $.input.label)}
				</label>
				<form
					className="core-gap flex flex-col items-center justify-between lg:flex-row"
					name="shortener-form"
					onSubmit={(e) => {
						e.preventDefault();
						handleShortener();
					}}
				>
					<Input
						className="h-12 w-full xl:h-14"
						id="long-link"
						leftIcon={<Link className="mx-2 size-4" />}
						placeholder={t(($) => $.input.placeholder)}
						required
						rightIcon={<ClearInputButton hidden={url === ''} onClick={clearUrl} />}
						type="url"
						value={url}
						onChange={(e) => setUrl(e.target.value)}
					/>
					<Button
						className={cn('h-12 w-full min-w-40 lg:w-fit xl:h-14', url && shortUrl === '' && 'active-btn')}
						disabled={!url}
						loading={isLoading}
						type="submit"
					>
						{t(($) => $.input.shorten)}
					</Button>
				</form>
			</div>
			{shortUrl && <ResultBlock shortUrl={shortUrl} onCopied={(message) => onNotice(message, 'success')} />}
			<Button className="mx-auto w-full text-(--color-secondary) xl:w-72" onClick={onOpenLinks}>
				{t(($) => $.result.recent)}
			</Button>
		</>
	);
};
