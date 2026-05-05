import { NotFound } from '@/shared/assets/images';
import { usePageTitle } from '@/shared/lib/hooks';
import { Link } from '@/shared/ui';

const NotFoundPage = () => {
	usePageTitle('Страница не найдена');

	return (
		<div className="flex flex-1 flex-col justify-evenly select-none lg:flex-row lg:justify-between">
			<div className="flex flex-col items-center justify-center gap-4 xl:flex-1 xl:gap-8">
				<h1 className="text-center text-2xl leading-[1.1] font-medium md:text-5xl">
					Странно... <br /> такой страницы нет
				</h1>
				<div className="leading-relaxed md:w-xl md:text-lg">
					<p>
						Страница, на которую вы попали, не существует. Возможно, она была удалена или перемещена. Вы
						можете попробовать:
					</p>
					<ul className="list-dash">
						<li className="flex items-center">
							<Link
								className="text-(--accent-primary) hover:text-(--accent-primary-hover) hover:underline"
								size="custom"
								to="/"
								variant="mobile"
							>
								Перейти на главную страницу
							</Link>
						</li>
						<li>Проверить правильность введенного адреса</li>
						<li>Вернуться назад через кнопку в браузере</li>
					</ul>
				</div>
			</div>
			<div className="flex items-center justify-center md:flex-1">
				<NotFound className="text-black md:pt-20" />
			</div>
		</div>
	);
};

export default NotFoundPage;
