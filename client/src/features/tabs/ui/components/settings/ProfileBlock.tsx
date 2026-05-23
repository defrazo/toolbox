import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CircleUserRound, Mail, Save } from 'lucide-react';
import { observer } from 'mobx-react-lite';

import { useStore } from '@/app/providers';
import { Button, Input } from '@/shared/ui';

import { Row } from '.';

type ActiveField = 'username' | 'email' | null;

export const ProfileBlock = observer(() => {
	const { t } = useTranslation('auth');
	const { userStore } = useStore();

	const [tempUsername, setTempUsername] = useState(userStore.username ?? '');
	const [tempEmail, setTempEmail] = useState(userStore.email ?? '');
	const [activeField, setActiveField] = useState<ActiveField>(null);

	const canSaveUsername = activeField === 'username' && tempUsername && tempUsername !== userStore.username;
	const canSaveEmail = activeField === 'email' && tempEmail && tempEmail !== userStore.email;

	useEffect(() => {
		if (!userStore.user) return;

		setTempUsername(userStore.username ?? '');
		setTempEmail(userStore.email ?? '');
	}, [userStore.user, userStore.username, userStore.email]);

	return (
		<div className="core-gap flex flex-1 flex-col">
			<Row icon={CircleUserRound} label={t(($) => $.fields.username.label)}>
				<Input
					className="lg:ml-auto lg:w-72"
					placeholder={t(($) => $.fields.username.placeholder)}
					rightIcon={
						canSaveUsername && (
							<Button
								centerIcon={<Save className="hidden size-5 md:block" />}
								className="pr-1"
								size="custom"
								variant="mobile"
								onClick={() => userStore.updateUsername(tempUsername)}
							/>
						)
					}
					value={tempUsername}
					onBlur={() => setActiveField(null)}
					onChange={(e) => setTempUsername(e.target.value)}
					onFocus={() => setActiveField('username')}
				/>
			</Row>
			<Row icon={Mail} label={t(($) => $.fields.email.label)}>
				<Input
					className="lg:ml-auto lg:w-72"
					placeholder={t(($) => $.fields.email.placeholder)}
					rightIcon={
						canSaveEmail && (
							<Button
								centerIcon={<Save className="hidden size-5 md:block" />}
								className="pr-1"
								size="custom"
								variant="mobile"
								onClick={() => userStore.updateEmail(tempEmail)}
							/>
						)
					}
					value={tempEmail}
					onBlur={() => setActiveField(null)}
					onChange={(e) => setTempEmail(e.target.value)}
					onFocus={() => setActiveField('email')}
				/>
			</Row>
		</div>
	);
});
