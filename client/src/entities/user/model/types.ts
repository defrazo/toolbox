export interface User {
	id: number;
	email: string;
	username: string;
	avatar?: string;
	role?: 'admin' | 'user';
}
