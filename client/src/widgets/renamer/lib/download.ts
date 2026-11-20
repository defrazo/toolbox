import { saveAs } from 'file-saver';
import JSZip from 'jszip';

export const downloadAsZip = async (files: File[]) => {
	const zip = new JSZip();

	files.forEach((file) => zip.file(file.name, file));

	const content = await zip.generateAsync({ type: 'blob' });

	const now = new Date();
	const formatter = new Intl.DateTimeFormat('ru-RU', {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
		hour12: false,
	});

	const formattedDate = formatter
		.format(now)
		.replace(/(\d{2})\.(\d{2})\.(\d{4}),/, '$3-$2-$1')
		.replace(/:/g, '-')
		.replace(/, /, '_');

	saveAs(content, `Renamed_${formattedDate}.zip`);
};
