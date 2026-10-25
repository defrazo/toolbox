import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { CircleAlert, LoaderCircle, MailCheck } from 'lucide-react';
import { observer } from 'mobx-react-lite';

import { useStore } from '@/app/providers';
import { api } from '@/shared/api';
import { Button } from '@/shared/ui';

type Status = 'loading' | 'success' | 'error';

export const VerifyEmailForm = observer(() => {
	const { t } = useTranslation('auth');
	const navigate = useNavigate();

	const { userStore, authStore } = useStore();

	const { id, hash } = useParams();
	const [searchParams] = useSearchParams();

	const [status, setStatus] = useState<Status>('loading');
	const verifiedRef = useRef(false);

	const type = searchParams.get('type') === 'pending' ? 'pending' : 'register';
	const query = searchParams.toString();

	useEffect(() => {
		if (verifiedRef.current) return;

		const params = Object.fromEntries(new URLSearchParams(query).entries());

		if (!id || !hash || !params.expires || !params.signature) {
			setStatus('error');
			return;
		}

		verifiedRef.current = true;

		let cancelled = false;

		const verify = async () => {
			try {
				if (type === 'pending') {
					const { data } = await api.get<{ user: NonNullable<typeof userStore.user> }>(
						`/user/email/verify/${id}/${hash}`,
						{ params }
					);

					if (cancelled) return;

					userStore.setUser(data.user);
				} else {
					await authStore.verifyEmail(id, hash, params);

					if (cancelled) return;
				}

				setStatus('success');
			} catch {
				if (!cancelled) setStatus('error');
			}
		};

		void verify();

		return () => {
			cancelled = true;
		};
	}, [id, hash, query, type, authStore, userStore]);

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
					<Button className="active-btn mt-4 h-10 w-full" onClick={() => navigate('/')}>
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
