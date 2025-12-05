import { api } from '@/shared/lib/api/api';
import type { ITour } from '../model/types';

export const busToursApi = {
	getTours: async (
		params?: Record<string, string | number | boolean>
	): Promise<ITour[]> => {
		try {
			const response = await api.get<ITour[]>('/api/admin/bus-tours', { params });
			return response?.data;
		} catch (err: any) {
			console.error(err);
			throw err;
		}
	},

	getCitiesList: async (): Promise<SelectItem[]> => {
		try {
			const response = await api.get<SelectItem[]>('/api/admin/bus-tours/cities-list');
			return response?.data;
		} catch (err: any) {
			console.error(err);
			throw err;
		}
	},

	getTour: async (id: string): Promise<ITour> => {
		try {
			const response = await api.get<ITour>('/api/admin/bus-tours/' + id);
			return response?.data;
		} catch (err: any) {
			console.error(err);
			throw err;
		}
	},

	editTour: async (tour: ITour): Promise<ITour | JSON | Error> => {
		const url = `/api/admin/bus-tours/${tour._id}`;

		const response = await api.put<ITour>(url, tour);
		return response?.data;
	},

	createTour: async (tour: ITour): Promise<void | JSON | Error> => {
		await api.post<void>('/api/admin/bus-tours', tour);
	},

	deleteTour: async (id: string): Promise<void> => {
		try {
			await api.delete('/api/admin/bus-tours/' + id);
		} catch (err: any) {
			console.error(err);
			throw err;
		}
	},

	uploadFile: async (
		File: FormData,
	): Promise<string> => {
		try {
			const res: string = await api.upload('/api/admin/s3/upload', File);
			return res;
		} catch (err: any) {
			console.error(err);
			throw err;
		}
	},

	getFile: async (
		fileName: string,
	): Promise<File> => {
		try {
			const res = await api.downloadBlob(`/api/s3/download/${fileName}`,);
			return new File([res], fileName);
		} catch (err: any) {
			console.error(err);
			throw err;
		}
	},

	deleteFile: async (
		fileName: string,
	): Promise<boolean> => {
		try {
			const res = await api.delete<boolean>(`/api/admin/s3/delete?uuid=${fileName}`);
			return res?.data;
		} catch (err: any) {
			console.error(err);
			throw err;
		}
	},

	togglePublishTour: async (id: string, published: boolean) => {
		const res = await api.patch(`/api/admin/bus-tours/published/${id}`, { published });
		return res?.data;
	}
};
