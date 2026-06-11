import { useTranslation } from 'react-i18next';

import { Button, Preloader } from '@/shared/ui';

interface ConfirmDialogProps {
	link: string | undefined;
	isPending: boolean;
	onConfirm: () => void;
	onCancel: () => void;
}

export const ConfirmDialog = ({ link, isPending, onConfirm, onCancel }: ConfirmDialogProps) => {
	const { t } = useTranslation('links');

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-(--bg-overlay) p-4 backdrop-blur-[2px]">
			<div className="core-border core-pad core-gap flex w-full max-w-md flex-col bg-(--bg-secondary) text-center backdrop-blur-md">
				{isPending ? (
					<div className="flex flex-col items-center">
						<Preloader className="size-7 border-(--accent-primary) border-t-(--border-color)" />
						<span className="animate-pulse text-lg text-(--color-secondary)">
							{t(($) => $.success.deletingLink)}
						</span>
					</div>
				) : (
					<>
						<span>
							{t(($) => $.confirm.question)}{' '}
							<span className="py-4 font-medium text-(--color-accent)">{link}</span> ?
						</span>
						<div className="flex justify-between gap-4">
							<Button className="flex-1" disabled={isPending} onClick={onConfirm}>
								{t(($) => $.confirm.delete)}
							</Button>
							<Button className="flex-1" disabled={isPending} onClick={onCancel}>
								{t(($) => $.confirm.cancel)}
							</Button>
						</div>
					</>
				)}
			</div>
		</div>
	);
};
