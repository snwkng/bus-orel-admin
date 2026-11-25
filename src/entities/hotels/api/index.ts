import { api } from '@/shared/api/api';
import type { CreateHotelDto, EditHotelDto } from '../model/types';
import type { ApiResponse, SelectItem } from '@/shared/api/types';
import { omitMetaFields } from '@/shared/lib/omitMetaFields';

export const hotelsApi = {
	getHotels: async (
		params?: Record<string, string | number | boolean>
	): Promise<ApiResponse<EditHotelDto[]>> => {
		const response = await api.get<EditHotelDto[]>('/api/admin/hotels', { params });
		return response;
	},

	getCitiesList: async (): Promise<SelectItem[]> => {
		const response = await api.get<SelectItem[]>('/api/admin/hotels/cities-list');
		return response?.data;
	},

	getHotel: async (id: string): Promise<EditHotelDto> => {
		const response = await api.get<EditHotelDto>('/api/admin/hotels/' + id);
		return response?.data;
	},

	editHotel: async (hotel: EditHotelDto): Promise<EditHotelDto> => {
		const url = `/api/admin/hotels/${hotel._id}`;

		const response = await api.put<EditHotelDto>(url, omitMetaFields(hotel));
		return response?.data;
	},

	createHotel: async (hotel: CreateHotelDto): Promise<void> => {
		await api.post<void>('/api/admin/hotels', hotel);
	},

	deleteHotel: async (id: string): Promise<void> => {
		await api.delete('/api/admin/hotels/' + id);
	},

	togglePublishHotel: async (id: string, published: boolean): Promise<EditHotelDto> => {
		const res = await api.patch<EditHotelDto>(`/api/admin/hotels/published/${id}`, { published });
		return res?.data;
	}
};
