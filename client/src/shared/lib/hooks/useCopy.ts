/**
 * useCopy – хук для копирования текста в буфер обмена с уведомлением.
 *
 * Возвращает функцию copy, которую можно вызывать в обработчиках.
 *
 * @returns (data: string, message?: string) => void
 *
 * Пример:
 *   const copy = useCopy(onCopied);
 *   <Button onClick={() => copy("Текст", "Скопировано")} />
 */

import copy from 'copy-to-clipboard';

export const useCopy = (onCopied: (message: string) => void) => {
	return (data: string, message?: string) => {
		copy(data);
		onCopied(message ?? 'Данные скопированы');
	};
};
