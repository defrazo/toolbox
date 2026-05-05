import { FileLock, FolderPen, Link, ShieldCheck } from 'lucide-react';

import { Logo } from '@/shared/ui';

export const AuthSidebar = () => {
	const features = [
		{ title: 'Переименование файлов', desc: 'Массовое переименование файлов в пару кликов', icon: FolderPen },
		{ title: 'Сокращение ссылок', desc: 'Быстрое сокращение ссылок для ваших задач', icon: Link },
		{ title: 'Безопасность', desc: 'Ваши данные под надежной защитой', icon: FileLock },
	];
	return (
		<div className="relative z-0 h-full w-lg">
			<div className="relative z-10 flex h-full flex-col gap-16 rounded-l-xl border-t border-b border-l border-(--border-color) p-12">
				<Logo />
				<div className="flex flex-col gap-6">
					<h1 className="text-4xl font-bold">
						Добро пожаловать <br />в Tool<span className="text-[#5b5cff]">Box</span>
					</h1>
					<h2 className="text-lg text-(--color-secondary)">Ваши инструменты для повседневной работы</h2>
				</div>
				<div className="flex flex-1 flex-col gap-10">
					{features.map(({ title, desc, icon: Icon }, idx) => {
						return (
							<div key={idx} className="flex gap-4">
								<div className="aspect-square size-14 rounded-xl bg-linear-to-br from-[#5b5cff]/20 via-[#7a5cff]/20 to-[#4da3ff]/20 p-3">
									<Icon className="size-full text-[#5b5cff]" />
								</div>
								<div className="flex flex-col gap-2">
									<h3 className="text-lg leading-4">{title}</h3>
									<span className="leading-tight text-(--color-disabled)">{desc}</span>
								</div>
							</div>
						);
					})}
				</div>
				<div className="flex gap-2">
					<ShieldCheck />
					<span className="text-(--color-disabled)">Мы не передаем ваши данные третьим лицам</span>
				</div>
			</div>
			<div className="absolute top-1/3 left-0 size-100 -translate-x-1/2 rounded-full bg-[#7a5cff]/40 blur-[120px]" />
		</div>
	);
};
