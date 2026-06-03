export const validatePassword = (password: string): 'empty' | 'invalid' | 'valid' => {
	const normalized = password.trim();
	if (!normalized) return 'empty';

	const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
	return passwordRegex.test(normalized) ? 'valid' : 'invalid';
};
