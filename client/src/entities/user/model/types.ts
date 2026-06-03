import type { AvatarId } from '@/shared/assets/images/avatars';

export type User = {
	id: number;
	email: string;
	username: string;
	avatar: AvatarId | null;
	pending_email: string | null;
	email_verified_at: string | null;
	is_demo?: boolean;
};
