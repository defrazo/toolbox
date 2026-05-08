import { useState } from 'react';
import { ChevronRight, FolderPen, LayoutDashboard, Link, Lock, Pencil, Route, Sun, UserCircle } from 'lucide-react';

import { cn } from '@/shared/lib/utils';
import { Divider } from '@/shared/ui';

export const TabHelp = () => {
	const [openFaq, setOpenFaq] = useState<number | null>(null);

	const toggleFaq = (index: number) => {
		setOpenFaq((prev) => (prev === index ? null : index));
	};

	const gettingStarted = [
		{
			icon: LayoutDashboard,
			title: 'Что такое ToolBox?',
			desc: 'ToolBox – набор инструментов для повседневных задач. Выбрать подходящий инструмент можно на главной странице или через боковое меню.',
		},
		{
			icon: Route,
			title: 'Как устроен интерфейс',
			desc: 'Слева – панель навигации с инструментами и разделами. По центру – рабочая область. В настройках можно сменить тему, аватар, язык и другое.',
		},
	];

	const toolsHelp = [
		{
			id: 'renamer',
			title: 'Переименователь файлов',
			subtitle:
				'Массово переименовывает файлы по шаблону: префикс + порядковый номер + суффикс. Результат скачивается ZIP-архивом.',
			icon: FolderPen,
			steps: [
				'Нажмите «Загрузить файлы» или перетащите их в зону загрузки. Максимум 100 файлов за раз.',
				'Введите префикс (часть до номера) и суффикс (часть после номера). Например: photo_ и _2025 → photo_01_2025.jpg.',
				'В колонках «До» и «После» проверьте предварительный результат.',
				'Нажмите «Скачать» – файлы придут ZIP-архивом с новыми именами (качество и размер файлов не изменится).',
			],
			hints: [
				'Кнопка «Добавить файлы» внизу позволяет дополнить список не сбрасывая его. «Очистить» – полностью сбросить.',
			],
		},
		{
			id: 'shortener',
			title: 'Сокращатель ссылок',
			subtitle:
				'Превращает длинные URL в короткие. Поддерживает публикацию в соцсетях, копирование в буфер обмена и генерацию QR-кода.',
			icon: Link,
			steps: [
				'Вставьте ссылку в поле «Длинная ссылка» и нажмите «Сократить».',
				'Скопируйте результат кнопкой «Скопировать» или поделитесь напрямую в ВКонтакте, Telegram или WhatsApp.',
				'Нажмите «QR-код» – появится изображение, которое можно сохранить скриншотом.',
			],
			hints: [],
		},
	];

	const accountTips = [
		{
			title: 'Аватар',
			text: 'Нажмите на фото, выберите из сетки и подтвердите кнопкой «Применить аватар».',
			icon: UserCircle,
		},
		{
			title: 'Имя и почта',
			text: 'Кликните в соответствующее поле, введите новое значение и нажмите иконку сохранения справа.',
			icon: Pencil,
		},
		{
			title: 'Пароль',
			text: 'Нажмите «Сменить пароль», заполните три поля и сохраните. Новый пароль должен соответствовать требованиям безопасности.',
			icon: Lock,
		},
		{
			title: 'Тема и язык',
			icon: Sun,
			text: 'Выберите из выпадающего списка подходящий вариант',
		},
	];

	const faq = [
		{
			question: 'Почему кнопка «Скачать» неактивна?',
			answer: 'Кнопка активируется только после того, как добавлен хотя бы один файл.',
		},
		{
			question: 'Можно ли добавить больше 100 файлов?',
			answer: 'Нет, текущее ограничение – 100 файлов за одby подход. Для большего объёма разбейте файлы на несколько групп.',
		},
		{
			question: 'Мои файлы загружаются на сервер?',
			answer: 'Нет. Переименование происходит прямо в браузере, файлы не покидают ваше устройство.',
		},
		{
			question: 'Ссылка не сокращается – что делать?',
			answer: 'Убедитесь, что URL начинается с https:// и является корректным адресом. Если ошибка повторяется, попробуйте позже.',
		},
	];

	return (
		<div className="hide-scrollbar flex h-full min-h-0 flex-col gap-8 overflow-auto">
			<section className="flex flex-1 flex-col gap-4">
				<h2 className="text-lg leading-4 text-(--color-secondary) opacity-70 select-none">Начало работы</h2>
				<div className="flex flex-col gap-4 2xl:flex-row">
					{gettingStarted.map(({ icon: Icon, title, desc }) => (
						<div
							key={title}
							className="core-border flex flex-1 items-center gap-4 bg-(--bg-secondary)/50 p-5"
						>
							<div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-(--accent-primary-dark) p-3">
								<Icon className="size-full text-(--color-accent)" />
							</div>
							<div className="flex flex-col">
								<span className="font-medium">{title}</span>
								<span className="text-sm leading-tight">{desc}</span>
							</div>
						</div>
					))}
				</div>
			</section>
			<section className="flex flex-1 flex-col gap-4">
				<h2 className="text-lg leading-4 text-(--color-secondary) opacity-70 select-none">Инструменты</h2>
				<div className="flex flex-col gap-4">
					{toolsHelp.map(({ id, title, subtitle, steps, icon: Icon, hints }) => {
						return (
							<div
								key={id}
								className="core-border flex flex-col gap-4 bg-(--bg-secondary)/50 p-5 2xl:flex-row"
							>
								<div className="flex min-w-xl flex-1 items-center gap-4">
									<div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-(--accent-primary-dark) p-3">
										<Icon className="size-full text-(--color-accent)" />
									</div>
									<div className="flex flex-col">
										<span className="text-xl font-medium">{title}</span>
										<span className="text-sm leading-tight text-(--color-secondary)">
											{subtitle}
										</span>
									</div>
								</div>
								<div className="hidden h-full w-px bg-(--border-color) 2xl:block" />
								<div className="flex flex-2 flex-col gap-3">
									{steps.map((step, idx) => (
										<div key={idx} className="flex items-center gap-3">
											<div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-(--accent-primary-dark) text-xs">
												{idx + 1}
											</div>
											<span className="leading-tight">{step}</span>
										</div>
									))}
									{hints.length !== 0 && (
										<div className="flex flex-col gap-1 rounded-lg bg-(--bg-tertiary)/70 px-4 py-3">
											{hints.map((hint, idx) => (
												<span
													key={idx}
													className="text-sm leading-tight text-(--color-secondary)"
												>
													{hint}
												</span>
											))}
										</div>
									)}
								</div>
							</div>
						);
					})}
				</div>
			</section>
			<section className="flex flex-1 flex-col gap-4">
				<h2 className="text-lg leading-4 text-(--color-secondary) opacity-70 select-none">
					Настройки аккаунта
				</h2>
				<div className="flex flex-col gap-4 xl:flex-row">
					{accountTips.map(({ title, text, icon: Icon }) => (
						<div
							key={text}
							className="core-border flex flex-1 flex-col items-center gap-3 bg-(--bg-secondary)/50 px-4 py-3"
						>
							<div className="mr-auto flex items-center gap-2">
								<Icon className="mt-0.5 size-5 shrink-0 text-(--color-accent)" />
								<span>{title}</span>
							</div>
							<Divider />
							<span className="text-center text-sm leading-tight">{text}</span>
						</div>
					))}
				</div>
			</section>
			<section className="flex flex-1 flex-col gap-4">
				<h2 className="text-lg leading-4 text-(--color-secondary) opacity-70 select-none">
					Часто задаваемые вопросы
				</h2>
				<div className="flex flex-col gap-3">
					{faq.map(({ question, answer }, idx) => {
						const isOpen = openFaq === idx;

						return (
							<div
								key={question}
								className="core-border flex cursor-pointer flex-col bg-(--bg-secondary)/50 px-3 py-2"
								onClick={() => toggleFaq(idx)}
							>
								<div className="flex items-center justify-between">
									<span className="font-medium">{question}</span>
									<ChevronRight
										className={cn(
											'text-sm text-(--color-secondary) transition-transform duration-300 hover:text-(--color-accent)',
											isOpen ? 'rotate-90' : 'rotate-0'
										)}
									/>
								</div>
								<div
									className={cn(
										'overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out',
										isOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
									)}
								>
									<span className="mt-2 block text-sm leading-tight">{answer}</span>
								</div>
							</div>
						);
					})}
				</div>
			</section>
		</div>
	);
};
