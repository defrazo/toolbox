import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface PasswordHintProps {
	password: string;
	showHint: boolean;
}

type PasswordRule = {
	id: 'minLength' | 'uppercase' | 'lowercase' | 'number' | 'latinOnly';
	test: (pass: string) => boolean;
};

const passwordRules: PasswordRule[] = [
	{ id: 'minLength', test: (pass) => pass.length >= 8 },
	{ id: 'uppercase', test: (pass) => /[A-Z]/.test(pass) },
	{ id: 'lowercase', test: (pass) => /[a-z]/.test(pass) },
	{ id: 'number', test: (pass) => /\d/.test(pass) },
	{ id: 'latinOnly', test: (pass) => !/[А-Яа-яЁё]/.test(pass) },
];

export const PasswordHint = ({ password, showHint }: PasswordHintProps) => {
	const { t } = useTranslation('auth');

	const allRulesPassed = passwordRules.every((rule) => rule.test(password));
	const visible = showHint && password.length > 0 && !allRulesPassed;

	useEffect(() => {
		if (!password) return;
	}, [allRulesPassed]);

	if (!visible) return null;

	return (
		<div className="absolute top-full z-40 mt-2 w-full rounded-xl border border-(--accent-primary-hover-op) bg-(--bg-tertiary) p-2 text-sm backdrop-blur-sm select-none">
			<ul className="space-y-1">
				{passwordRules.map((rule, idx) => {
					const passed = rule.test(password);
					return (
						<li key={idx} className={passed ? 'text-(--status-success)' : 'text-(--status-error)'}>
							{passed ? '✔' : '✖'} {t(($) => $.common.passHint[rule.id])}
						</li>
					);
				})}
			</ul>
		</div>
	);
};
