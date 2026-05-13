import type { ReactNode } from 'react';
import { makeAutoObservable, observable } from 'mobx';

import type { ModalConfig, ModalType } from '.';

export class ModalStore {
	modal: ModalConfig | null = null;

	get modalType(): ModalType | undefined {
		return this.modal?.type;
	}

	setModal(
		content: ReactNode,
		type: ModalType = 'modal',
		options?: { back?: () => void; position?: { top: number; left: number }; onClose?: () => void }
	): void {
		this.modal = {
			content,
			type,
			back: options?.back,
			position: options?.position,
			onClose: options?.onClose,
		};

		document.body.style.overflow = 'hidden';
	}

	closeModal(): void {
		this.modal = null;
		document.body.style.overflow = '';
	}

	setBack(handler: () => void): void {
		if (this.modal) this.modal.back = handler;
	}

	resetBack(): void {
		if (this.modal) this.modal.back = undefined;
	}

	constructor() {
		makeAutoObservable(this, { modal: observable.ref });
	}
}
