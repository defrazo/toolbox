import type { ReactNode } from 'react';
import { makeAutoObservable, observable } from 'mobx';

import type { ModalConfig, ModalType } from '.';

export class ModalStore {
	modal: ModalConfig | null = null;

	get modalType(): ModalType | undefined {
		return this.modal?.type;
	}

	setModal(content: ReactNode, type: ModalType = 'modal', options?: { onClose?: () => void }): void {
		this.modal = { content, type, onClose: options?.onClose };
		document.body.style.overflow = 'hidden';
	}

	closeModal(): void {
		this.modal = null;
		document.body.style.overflow = '';
	}

	constructor() {
		makeAutoObservable(this, { modal: observable.ref });
	}
}
