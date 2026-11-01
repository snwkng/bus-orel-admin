import { api } from './api';

export const uploadFile = async (file: FormData): Promise<string> => {
	const res = await api.upload<string>('/api/admin/s3/upload', file);
	return res.data;
};

export const getFile = async (fileName: string): Promise<File> => {
	const res = await api.downloadBlob(`/api/s3/download/${fileName}`);
	return new File([res], fileName);
};

export const deleteFile = async (fileName: string): Promise<boolean> => {
	const res = await api.delete<boolean>(`/api/admin/s3/delete?uuid=${fileName}`);
	return res.data;
};
