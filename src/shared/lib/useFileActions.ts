import { api } from '@/shared/api/api';
import { getFile } from '@/shared/api/s3';
import { useToast } from '@/shared/lib/useToasts';

export const useFileActions = () => {
	const { show } = useToast();

	const openFileInNewTab = async (fileName: string): Promise<void> => {
		try {
			const file = await getFile(fileName);
			const url = URL.createObjectURL(file);
			const link = document.createElement('a');
			link.href = url;
			link.target = '_blank';
			link.rel = 'noopener noreferrer';
			document.body.appendChild(link);
			link.click();
			link.remove();
			setTimeout(() => URL.revokeObjectURL(url), 60_000);
		} catch (err) {
			console.error(err);
			show('Не удалось открыть файл', 'error');
		}
	};

	const downloadFile = async (fileName: string): Promise<void> => {
		try {
			const file = await getFile(fileName);
			api.saveBlobAs(file, file.name);
		} catch (err) {
			console.error(err);
			show('Не удалось скачать файл', 'error');
		}
	};

	return { openFileInNewTab, downloadFile };
};
