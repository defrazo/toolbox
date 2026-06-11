import { useTranslation } from 'react-i18next';
import { Info, RefreshCw } from 'lucide-react';

import { Button } from '@/shared/ui';

interface LinksFooterProps {
	isDemo: boolean;
	isLoading: boolean;
	onRefresh: () => void;
}

export const LinksFooter = ({ isDemo, isLoading, onRefresh }: LinksFooterProps) => {
	const { t } = useTranslation('links');

	return (
		<div className="flex items-center justify-center rounded-xl border-(--border-color) text-sm select-none xl:justify-between xl:border xl:bg-(--bg-secondary)/50 xl:p-3 xl:shadow-(--shadow)">
			<div className="hidden items-center gap-2 text-(--color-disabled) xl:flex">
				<Info className="size-4" />
				{isDemo ? <span>{t(($) => $.footer.demoInfo)}</span> : <span>{t(($) => $.footer.userInfo)}</span>}
			</div>
			<Button
				className="active-btn w-36"
				leftIcon={<RefreshCw className="size-4" />}
				loading={isLoading}
				onClick={onRefresh}
			>
				{t(($) => $.footer.refresh)}
			</Button>
		</div>
	);
};
