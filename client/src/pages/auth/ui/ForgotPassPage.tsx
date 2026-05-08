import { Link } from 'react-router-dom';

import { AuthFormHeader, ForgotPassForm } from '@/features/auth';

export const ForgotPassPage = () => {
	return (
		<div className="hide-scrollbar relative flex h-full min-h-0 w-full flex-1 cursor-default flex-col gap-4 rounded-r-xl border border-(--border-color) p-3 shadow-(--shadow) md:p-6">
			<div className="core-border m-auto flex w-lg flex-col items-center justify-center gap-4 bg-(--bg-secondary)/50 p-12 text-(--accent-primary-text)">
				<AuthFormHeader title="Восстановить пароль" />
				<p className="text-justify">
					Введите e-mail, к которому привязан ваш аккаунт ToolBox. Мы отправим на него письмо с инструкциями
					по восстановлению пароля.
				</p>
				<p className="text-justify text-(--color-disabled)">
					Пожалуйста, проверьте почту, включая папку «Спам». Если письмо не придет, убедитесь, что адрес
					указан правильно и попробуйте запросить письмо повторно.
				</p>
				<ForgotPassForm />
				<Link className="cursor-pointer font-semibold hover:text-(--accent-primary-hover)" to="/login">
					Вернуться назад
				</Link>
			</div>
			<div className="absolute top-1/2 right-0 size-100 translate-x-1/2 -translate-y-1/2 rounded-full bg-[#7a5cff]/30 blur-[120px]" />
		</div>
	);
};
