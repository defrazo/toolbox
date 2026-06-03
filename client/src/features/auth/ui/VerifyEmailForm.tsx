import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { CircleAlert, LoaderCircle, MailCheck } from 'lucide-react';
import { observer } from 'mobx-react-lite';

import { useStore } from '@/app/providers';
import type { User } from '@/entities/user';
import { api } from '@/shared/api';
import { Button } from '@/shared/ui';

type VerifiedData = { user: User; token: string };

type Status = 'loading' | 'success' | 'error';

export const VerifyEmailForm = observer(() => {
	const { t } = useTranslation('auth');
	const navigate = useNavigate();

	const { userStore, authStore } = useStore();

	const { id, hash } = useParams();
	const [searchParams] = useSearchParams();

	const [status, setStatus] = useState<Status>('loading');
	const [verifiedData, setVerifiedData] = useState<VerifiedData | null>(null);

	const type = searchParams.get('type') ?? 'register';

	const endpoint = type === 'pending' ? `/user/email/verify/${id}/${hash}` : `/email/verify/${id}/${hash}`;

	useEffect(() => {
		const expires = searchParams.get('expires');
		const signature = searchParams.get('signature');

		if (!id || !hash || !expires || !signature) {
			setStatus('error');
			return;
		}

		api.get(endpoint, { params: { expires, signature } })
			.then((response) => {
				if (type === 'pending') userStore.setUser(response.data.user);
				else setVerifiedData(response.data);
				setStatus('success');
			})
			.catch(() => setStatus('error'));
	}, [id, hash, type, endpoint]);

	return (
		<div className="flex flex-col items-center gap-2 select-none">
			<div className="rounded-full border-3 border-(--color-accent) p-2 shadow-(--shadow-secondary) lg:p-3">
				{status === 'loading' && <LoaderCircle className="size-8 animate-spin text-(--color-accent)" />}
				{status === 'success' && <MailCheck className="size-8 text-(--color-accent)" />}
				{status === 'error' && <CircleAlert className="size-8 text-(--color-accent)" />}
			</div>
			<h2 className="text-center text-2xl font-semibold">{t(($) => $.screens.verifyEmail.title)}</h2>
			{status === 'loading' && (
				<p className="text-justify text-(--color-secondary)">{t(($) => $.screens.verifyEmail.loading)}</p>
			)}
			{status === 'success' && (
				<>
					<p className="text-center whitespace-pre-line text-(--color-secondary)">
						{t(($) => $.screens.verifyEmail.successMessage)}
					</p>
					<Button
						className="active-btn mt-4 h-10 w-full"
						disabled={type !== 'pending' && !verifiedData}
						onClick={() => {
							if (type !== 'pending') {
								if (!verifiedData) return;

								authStore.setSession(verifiedData.user, verifiedData.token);
							}

							navigate('/');
						}}
					>
						{t(($) => $.screens.verifyEmail.successButton)}
					</Button>
				</>
			)}
			{status === 'error' && (
				<>
					<p className="text-justify text-(--color-secondary)">
						{t(($) => $.screens.verifyEmail.errorMessage)}
					</p>
					<Button className="active-btn mt-4 h-10 w-full" onClick={() => navigate('/email/verify')}>
						{t(($) => $.screens.verifyEmail.errorButton)}
					</Button>
				</>
			)}
		</div>
	);
});
