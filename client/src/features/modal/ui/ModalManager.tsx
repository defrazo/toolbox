import { observer } from 'mobx-react-lite';

import type { ModalStore } from '../model/modalStore';
import { Modal } from './Modal';

export const ModalManager = observer(({ modalStore }: { modalStore: Pick<ModalStore, 'modal' | 'closeModal'> }) => {
	const modal = modalStore.modal;
	if (!modal || modal.type === 'none') return null;

	return (
		<Modal onClose={modal.type === 'confirm' ? undefined : (modal.onClose ?? modalStore.closeModal)}>
			{modal.content}
		</Modal>
	);
});
