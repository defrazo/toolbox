import type { User } from '@/entities/user';

export interface AuthResponse {
	user: User;
}

export interface AuthSessionResponse {
	authenticated: boolean;
	user: User | null;
}

export interface RegisterPayload {
	username: string;
	email: string;
	password: string;
	password_confirmation: string;
	invite_token: string;
	privacy_accepted: boolean;
}

export interface ResetPasswordPayload {
	email: string;
	token: string;
	password: string;
	password_confirmation: string;
}
