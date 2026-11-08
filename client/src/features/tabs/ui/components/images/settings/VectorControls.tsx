import { useTranslation } from 'react-i18next';

import { SelectExt } from '@/shared/ui';

import { IMAGES, type VectorSettings } from '../../../../model';

interface VectorControlsProps {
	vector: VectorSettings;
	busy: boolean;
	setVector: (value: VectorSettings) => void;
}

export const VectorControls = ({ vector, busy, setVector }: VectorControlsProps) => {
	const { t } = useTranslation('images');

	return (
		<div className="flex min-w-0 flex-1 flex-col gap-2">
			<div className="grid grid-cols-2 gap-3">
				<div className="flex min-w-0 flex-col gap-1">
					<span className="text-sm text-(--color-secondary)">{t(($) => $.vectorize.detail)}</span>
					<SelectExt
						className="h-8 rounded-lg"
						disabled={busy}
						options={IMAGES.VECTOR.DETAILS.map((value) => ({
							value,
							label: t(($) => $.vectorize.details[value]),
						}))}
						value={vector.detail}
						onChange={(value) => {
							if (!IMAGES.VECTOR.DETAILS.some((detail) => detail === value)) return;
							setVector({ ...vector, detail: value as VectorSettings['detail'] });
						}}
					/>
				</div>
				<div className="flex min-w-0 flex-col gap-1">
					<span className="text-sm text-(--color-secondary)">{t(($) => $.vectorize.colors)}</span>
					<SelectExt
						className="h-8 rounded-lg"
						disabled={busy}
						options={IMAGES.VECTOR.COLORS.map((value) => ({
							value: String(value),
							label: String(value),
						}))}
						value={String(vector.colors)}
						onChange={(value) => {
							const colors = Number(value);
							if (!IMAGES.VECTOR.COLORS.some((color) => color === colors)) return;
							setVector({ ...vector, colors: colors as VectorSettings['colors'] });
						}}
					/>
				</div>
			</div>
			<p className="text-xs text-(--color-secondary)">{t(($) => $.vectorize.shortHint)}</p>
		</div>
	);
};

export const VectorInfo = () => {
	const { t } = useTranslation('images');

	return (
		<>
			<p>{t(($) => $.vectorize.hint)}</p>
			<p>{t(($) => $.vectorize.limits)}</p>
		</>
	);
};
