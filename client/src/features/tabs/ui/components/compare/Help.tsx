import { Trans, useTranslation } from 'react-i18next';
import { ArrowRightLeft } from 'lucide-react';

export const Help = () => {
	const { t } = useTranslation('compare');

	return (
		<div className="-mt-4 flex flex-col gap-4 text-left text-sm select-none">
			<p className="text-(--color-secondary)">{t(($) => $.help.description)}</p>
			<div className="overflow-hidden rounded-xl border border-(--border-color)">
				<div className="grid grid-cols-2 divide-x divide-(--border-color)">
					<div className="min-w-0">
						<div className="border-b border-(--border-color) bg-(--bg-secondary) px-3 py-2 text-xs font-medium">
							{t(($) => $.help.original)}
						</div>
						<div className="overflow-x-auto bg-(--bg-tertiary) p-3 font-mono text-xs whitespace-nowrap">
							const age = <span className="rounded bg-red-500/15 px-1 text-red-400">20</span>;
						</div>
					</div>
					<div className="min-w-0">
						<div className="border-b border-(--border-color) bg-(--bg-secondary) px-3 py-2 text-xs font-medium">
							{t(($) => $.help.modified)}
						</div>
						<div className="overflow-x-auto bg-(--bg-tertiary) p-3 font-mono text-xs whitespace-nowrap">
							const age = <span className="rounded bg-green-500/15 px-1 text-green-400">25</span>;
						</div>
					</div>
				</div>
				<div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-(--border-color) bg-(--bg-secondary)/50 px-3 py-2 text-xs text-(--color-secondary)">
					<span className="flex items-center gap-1.5">
						<span className="size-2 rounded-sm bg-(--status-error)" />
						{t(($) => $.help.removed)}
					</span>
					<span className="flex items-center gap-1.5">
						<span className="size-2 rounded-sm bg-(--status-success)" />
						{t(($) => $.help.added)}
					</span>
				</div>
			</div>
			<div className="flex items-center gap-3">
				<div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-(--bg-tertiary)">
					<ArrowRightLeft className="size-4 text-(--color-secondary)" />
				</div>
				<p className="text-sm leading-4.5 text-(--color-secondary)">
					<Trans
						components={{ strong: <strong className="text-(--color-primary)" /> }}
						i18nKey={($) => $.help.direction}
						ns="compare"
					/>
				</p>
			</div>
			<p className="border-t border-(--border-color) pt-3 text-xs leading-relaxed text-(--color-tertiary)">
				{t(($) => $.help.footer)}
			</p>
		</div>
	);
};
