import { api } from '@/shared/lib/api/api';
import type { CreateHotelDto, EditHotelDto } from '../model/types';

export const busToursApi = {
	getTours: async (
		params?: Record<string, string | number | boolean>
	): Promise<EditHotelDto[]> => {
		try {
			const response = await api.get<EditHotelDto[]>('/api/admin/hotels', { params });
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

	getTour: async (id: string): Promise<EditHotelDto> => {
		try {
			const response = await api.get<EditHotelDto>('/api/admin/hotels/' + id);
			return response?.data;
		} catch (err: any) {
			console.error(err);
			throw err;
		}
	},

	editTour: async (tour: EditHotelDto): Promise<EditHotelDto> => {
		const url = `/api/admin/hotels/${tour._id}`;

		const response = await api.put<EditHotelDto>(url, tour);
		return response?.data;
	},

	createTour: async (tour: CreateHotelDto): Promise<void | JSON | Error> => {
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
	) => {
		try {
			const res = await api.upload('/api/admin/s3/upload', File);
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

	togglePublishTour: async (id: string, published: boolean): Promise<EditHotelDto> => {
		const res = await api.patch<EditHotelDto>(`/api/admin/hotels/published/${id}`, { published });
		return res?.data;
	}
};
