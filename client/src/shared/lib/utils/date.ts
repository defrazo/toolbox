// Форматирует строку даты в полную дату + время в локали ru-RU (например: "31.07.2025, 14:05")
export const fullDate = (date: string): string =>
	new Date(date).toLocaleString('ru-RU', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	});
