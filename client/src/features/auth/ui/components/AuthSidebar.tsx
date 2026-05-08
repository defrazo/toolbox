import { FileLock, ShieldCheck } from 'lucide-react';

import { TOOLS } from '@/entities/tool';
import { Logo } from '@/shared/ui';

export const AuthSidebar = () => {
	const displayFeatures = [
		...TOOLS,
		{ title: 'Безопасность', subtitle: 'Ваши данные под надежной защитой', icon: FileLock },
	];

	return (
		<div className="relative z-0 h-full w-lg select-none">
			<div className="relative z-10 flex h-full flex-col gap-16 rounded-l-xl border-t border-b border-l border-(--border-color) p-12">
				<Logo />
				<div className="flex flex-col gap-6">
					<h1 className="text-4xl font-bold text-(--accent-primary-text)">
						Добро пожаловать <br />в Tool<span className="text-(--color-accent)">Box</span>
					</h1>
					<h2 className="text-lg text-(--color-secondary)">Ваши инструменты для повседневной работы</h2>
				</div>
				<div className="flex flex-1 flex-col gap-10">
					{displayFeatures.map(({ title, subtitle, icon: Icon }, idx) => {
						return (
							<div key={idx} className="flex gap-4">
								<div className="aspect-square size-14 rounded-xl bg-(--accent-primary-dark) p-3">
									<Icon className="size-full text-(--color-accent)" />
								</div>
								<div className="flex flex-col gap-2">
									<h3 className="text-lg leading-4 text-(--accent-primary-text)">{title}</h3>
									<span className="leading-tight text-(--color-disabled)">{subtitle}</span>
								</div>
							</div>
						);
					})}
				</div>
				<div className="flex gap-2 text-(--color-disabled)">
					<ShieldCheck />
					<span className="">Мы не передаем ваши данные третьим лицам</span>
				</div>
			</div>
			<div className="absolute top-1/3 left-0 size-100 -translate-x-1/2 rounded-full bg-[#7a5cff]/40 blur-[120px]" />
		</div>
	);
};
