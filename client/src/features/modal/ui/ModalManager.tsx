import { observer } from 'mobx-react-lite';

import { useStore } from '@/app/providers';

import { Modal } from '.';

export const ModalManager = observer(() => {
	const { modalStore } = useStore();

	const modal = modalStore.modal;
	if (!modal || modal.type === 'none') return null;

	return (
		<Modal
			onBack={modal.back}
			onClose={modalStore.closeModal}
			{...(modal.position && { position: modal.position })}
		>
			{modal.content}
		</Modal>
	);
});
