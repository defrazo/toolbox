import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, CircleUserRound, Mail, Save } from 'lucide-react';
import { observer } from 'mobx-react-lite';

import { useStore } from '@/app/providers';
import { updateEmail, updateProfile } from '@/entities/user';
import { emailCooldown, getAuthErrorMessage, useAuth } from '@/features/auth';
import { Button, Input } from '@/shared/ui';

import { Row } from '.';

export const ProfileBlock = observer(() => {
	const { t: tAuth } = useTranslation('auth');
	const { t: tSettings } = useTranslation('settings');
	const navigate = useNavigate();

	const { userStore, notifyStore } = useStore();
	const { checkUsername, checkEmail } = useAuth(tAuth);

	const [isLoading, setIsLoading] = useState(false);

	const [username, setUsername] = useState(userStore.username ?? '');
	const [email, setEmail] = useState(userStore.email ?? '');

	const canSaveUsername = username && username !== userStore.username;
	const canSaveEmail = !userStore.hasPendingEmail && email && email !== userStore.email;
	const isEmailLocked = !!userStore.pendingEmail;
	const shownEmail = userStore.pendingEmail ?? email;

	const applyUsername = async () => {
		if (!canSaveUsername) return;
		if (!checkUsername(username)) return;

		setIsLoading(true);

		try {
			const { data } = await updateProfile({ username: username });

			userStore.setUser(data.user);

			notifyStore.setNotice(
				tSettings(($) => $.success.username),
				'success'
			);
		} catch {
			notifyStore.setNotice(
				tSettings(($) => $.errors.username),
				'error'
			);
		} finally {
			setIsLoading(false);
		}
	};

	const applyEmail = async () => {
		if (!canSaveEmail) return;
		if (!checkEmail(email)) return;

		setIsLoading(true);

		try {
			const { data } = await updateEmail(email);

			userStore.setUser(data.user);
			emailCooldown.start();

			notifyStore.setNotice(
				tSettings(($) => $.success.email),
				'success'
			);
		} catch (error: any) {
			const code = error?.response?.data?.code;
			notifyStore.setNotice(getAuthErrorMessage(tAuth, code), 'error');
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		if (!userStore.user) return;

		setUsername(userStore.username ?? '');
		setEmail(userStore.email ?? '');
	}, [userStore.user, userStore.username, userStore.email]);

	return (
		<div className="core-gap flex flex-1 flex-col">
			<Row icon={CircleUserRound} label={tAuth(($) => $.common.fields.username.label)}>
				<Input
					className="lg:ml-auto lg:w-72"
					placeholder={tAuth(($) => $.common.fields.username.placeholder)}
					rightIcon={
						canSaveUsername && (
							<Button
								centerIcon={<Save className="hidden size-5 md:block" />}
								className="bg-transparent opacity-100"
								loading={isLoading}
								size="custom"
								variant="mobile"
								onClick={applyUsername}
							/>
						)
					}
					value={username}
					onChange={(e) => setUsername(e.target.value)}
				/>
			</Row>
			<Row icon={Mail} label={tAuth(($) => $.common.fields.email.label)}>
				<Input
					className="lg:ml-auto lg:w-72"
					disabled={isEmailLocked}
					placeholder={tAuth(($) => $.common.fields.email.placeholder)}
					rightIcon={
						isEmailLocked ? (
							<Button
								centerIcon={<AlertTriangle className="size-5 text-red-500" />}
								className="bg-transparent opacity-100"
								size="custom"
								variant="mobile"
								onClick={() => navigate('/email/verify')}
							/>
						) : (
							canSaveEmail && (
								<Button
									centerIcon={<Save className="hidden size-5 md:block" />}
									className="bg-transparent opacity-100"
									loading={isLoading}
									size="custom"
									variant="mobile"
									onClick={applyEmail}
								/>
							)
						)
					}
					value={shownEmail}
					onChange={(e) => setEmail(e.target.value)}
				/>
			</Row>
		</div>
	);
});
