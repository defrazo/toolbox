import { observer } from 'mobx-react-lite';

import { useStore } from '@/app/providers';

import { Modal } from '.';

export const ModalManager = observer(() => {
	const { modalStore } = useStore();

	const modal = modalStore.modal;
	if (!modal || modal.type === 'none') return null;

	return (
		<Modal onClose={modal.type === 'confirm' ? undefined : (modal.onClose ?? modalStore.closeModal)}>
			{modal.content}
		</Modal>
	);
});
