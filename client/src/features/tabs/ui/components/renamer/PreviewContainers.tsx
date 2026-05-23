import { useTranslation } from 'react-i18next';

import { cn } from '@/shared/lib/utils';

import { useRenamerContext } from '../../../model';

type PreviewFile = {
	oldName: string;
	newName: string;
};

type FileContainer = {
	id: 'before' | 'after';
	title: string;
	statusColor: string;
	getName: (file: PreviewFile) => string;
};

export const PreviewContainers = () => {
	const { t } = useTranslation('renamer');

	const { preview } = useRenamerContext();

	const fileContainers: FileContainer[] = [
		{
			id: 'before',
			title: t(($) => $.files.before),
			statusColor: 'bg-(--status-warning)',
			getName: (file: PreviewFile) => file.oldName,
		},
		{
			id: 'after',
			title: t(($) => $.files.after),
			statusColor: 'bg-(--status-success)',
			getName: (file: PreviewFile) => file.newName,
		},
	];
	return (
		<>
			{fileContainers.map(({ id, title, statusColor, getName }) => (
				<div
					key={id}
					className="core-border core-pad core-gap flex min-h-0 min-w-0 flex-1 flex-col bg-(--bg-secondary)/50 shadow-(--shadow)"
				>
					<div className="flex items-center gap-2">
						<div className={cn('mt-0.5 size-3 rounded-full', statusColor)} />
						<span className="text-lg leading-4 select-none">{title}</span>
					</div>
					<div className="hide-scrollbar max-h-64 min-h-32 flex-1 overflow-y-auto rounded-lg bg-(--bg-tertiary)/70 md:max-h-none">
						{preview.map((file, idx) => (
							<div
								key={`${file.oldName}-${idx}`}
								className="border-(--border-color) px-3 py-2 text-xs not-last:border-b xl:text-base"
							>
								<span className="text-(--color-disabled)">№ {idx + 1}.</span>{' '}
								<span className="wrap-break-word">{getName(file)}</span>
							</div>
						))}
					</div>
				</div>
			))}
		</>
	);
};
