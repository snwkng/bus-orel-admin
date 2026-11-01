import { defineStore } from 'pinia';
import type { CreateHotelDto, EditHotelDto } from './types';
import { hotelsApi } from '../api';
import type { IPagination } from '@/shared/config/interfaces/pagination.interface';
import type { SelectItem } from '@/shared/api/types';

export const useHotelStore = defineStore('useHotelStore', {
	state: () => ({
		hotels: [] as EditHotelDto[],
		pagination: null as null | IPagination,
		citiesList: [] as SelectItem[]
	}),
	actions: {
		async getHotels(params?: Record<string, string | number | boolean>): Promise<void> {
			const response = await hotelsApi.getHotels(params);
			this.hotels = response?.data;
			this.pagination = response?.meta?.pagination ?? null;
		},

		async getHotel(id: string): Promise<EditHotelDto> {
			return await hotelsApi.getHotel(id);
		},

		async createHotel(hotel: CreateHotelDto): Promise<void> {
			await hotelsApi.createHotel(hotel);
		},

		async editHotel(hotel: EditHotelDto): Promise<EditHotelDto> {
			return await hotelsApi.editHotel(hotel);
		},

		async deleteHotel(id: string): Promise<void> {
			await hotelsApi.deleteHotel(id);
		},

		async updateStatus(id: string, published: boolean): Promise<EditHotelDto> {
			return await hotelsApi.togglePublishHotel(id, published);
		},

		async getCitiesList(): Promise<void> {
			const res = await hotelsApi.getCitiesList();
			this.citiesList = res;
		}
	}
});
