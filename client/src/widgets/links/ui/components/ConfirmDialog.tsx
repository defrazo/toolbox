import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button, Preloader } from '@/shared/ui';

interface ConfirmDialogProps {
	link: string | undefined;
	onConfirm: () => Promise<void>;
	onCancel: () => void;
}

export const ConfirmDialog = ({ link, onConfirm, onCancel }: ConfirmDialogProps) => {
	const { t } = useTranslation('links');

	const [isPending, setIsPending] = useState(false);

	const handleConfirm = async () => {
		if (isPending) return;

		setIsPending(true);

		try {
			await onConfirm();
		} finally {
			setIsPending(false);
		}
	};

	return isPending ? (
		<div className="flex flex-col items-center">
			<Preloader className="size-7 border-(--accent-primary) border-t-(--border-color)" />
			<span className="animate-pulse text-lg text-(--color-secondary)">{t(($) => $.success.deletingLink)}</span>
		</div>
	) : (
		<div className="flex flex-col gap-2">
			<div className="whitespace-break-spaces xl:whitespace-normal">
				{t(($) => $.confirm.question)} <span className="font-medium text-(--color-accent)">{link}</span> ?
			</div>
			<div className="flex justify-between gap-4">
				<Button className="flex-1" disabled={isPending} onClick={handleConfirm}>
					{t(($) => $.confirm.delete)}
				</Button>
				<Button className="flex-1" disabled={isPending} onClick={onCancel}>
					{t(($) => $.confirm.cancel)}
				</Button>
			</div>
		</div>
	);
};
