import { useTranslation } from 'react-i18next';
import { Link } from 'lucide-react';

import { useCopy } from '@/shared/lib/hooks';
import { Button, Input } from '@/shared/ui';

import { ShareBlock } from '.';

export const ResultBlock = ({ shortUrl }: { shortUrl: string }) => {
	const { t } = useTranslation('shortener');

	const copy = useCopy();

	const onCopy = () =>
		copy(
			shortUrl,
			t(($) => $.result.copied)
		);

	return (
		<>
			<div className="h-0.5 w-full animate-pulse bg-linear-to-r from-transparent via-(--accent-primary-hover) to-transparent" />
			<div className="core-border core-pad flex flex-col gap-6 bg-(--bg-secondary)/50 shadow-(--shadow)">
				<div className="core-gap flex flex-col">
					<span className="w-fit leading-4 select-none">{t(($) => $.result.label)}</span>
					<div className="core-gap flex flex-col items-center justify-between lg:flex-row">
						<Input
							className="h-12 xl:h-14"
							disabled={!shortUrl}
							leftIcon={<Link className="mx-2 size-4" />}
							readOnly
							value={shortUrl}
						/>
						<Button
							className="active-btn h-12 w-full min-w-40 lg:w-fit xl:h-14"
							disabled={!shortUrl}
							onClick={onCopy}
						>
							{t(($) => $.result.copy)}
						</Button>
					</div>
				</div>
				<ShareBlock shortUrl={shortUrl} />
			</div>
		</>
	);
};
