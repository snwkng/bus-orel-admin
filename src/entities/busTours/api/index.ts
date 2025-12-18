import { api } from '@/shared/lib/api/api';
import type { CreateTourDto, EditTourDto } from '../model/types';

export const busToursApi = {
	getTours: async (
		params?: Record<string, string | number | boolean>
	): Promise<EditTourDto[]> => {
		try {
			const response = await api.get<EditTourDto[]>('/api/admin/hotels', { params });
			return response?.data;
		} catch (err: any) {
			console.error(err);
			throw err;
		}
	},

	getCitiesList: async (): Promise<SelectItem[]> => {
		try {
			const response = await api.get<SelectItem[]>('/api/admin/hotels/cities-list');
			return response?.data;
		} catch (err: any) {
			console.error(err);
			throw err;
		}
	},

	getTour: async (id: string): Promise<EditTourDto> => {
		try {
			const response = await api.get<EditTourDto>('/api/admin/hotels/' + id);
			return response?.data;
		} catch (err: any) {
			console.error(err);
			throw err;
		}
	},

	editTour: async (tour: EditTourDto): Promise<EditTourDto> => {
		const url = `/api/admin/hotels/${tour._id}`;

		const response = await api.put<EditTourDto>(url, tour);
		return response?.data;
	},

	createTour: async (tour: CreateTourDto): Promise<void | JSON | Error> => {
		await api.post<void>('/api/admin/hotels', tour);
	},

	deleteTour: async (id: string): Promise<void> => {
		try {
			await api.delete('/api/admin/hotels/' + id);
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

	togglePublishTour: async (id: string, published: boolean): Promise<EditTourDto> => {
		const res = await api.patch<EditTourDto>(`/api/admin/hotels/published/${id}`, { published });
		return res?.data;
	}
};
