type PasswordRule = {
	id: 'minLength' | 'uppercase' | 'lowercase' | 'number' | 'latinOnly';
	test: (pass: string) => boolean;
};

export const passwordRules: PasswordRule[] = [
	{ id: 'minLength', test: (pass) => pass.length >= 8 },
	{ id: 'uppercase', test: (pass) => /[A-Z]/.test(pass) },
	{ id: 'lowercase', test: (pass) => /[a-z]/.test(pass) },
	{ id: 'number', test: (pass) => /\d/.test(pass) },
	{ id: 'latinOnly', test: (pass) => !/[А-Яа-яЁё]/.test(pass) },
];
