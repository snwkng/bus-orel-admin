import { defineStore } from 'pinia';
import type { EditExcursionDto, CreateExcursionDto } from './types';
import { excursionsApi } from '../api';
import type { IPagination } from '@/shared/config/interfaces/pagination.interface';
import type { SelectItem } from '@/shared/api/types';

export const useExcursionStore = defineStore('useExcursionStore', {
	state: () => <{
		excursions: EditExcursionDto[]
		pagination: null | IPagination
		citiesList: SelectItem[]
		typesList: SelectItem[]
	}>({
		excursions: [],
		pagination: null,
		citiesList: [],
		typesList: []
	}),
	actions: {
		async getExcursions(params?: Record<string, string | number | boolean>): Promise<void> {
			const response = await excursionsApi.getExcursions(params)
			this.excursions = response?.data
			this.pagination = response?.meta?.pagination ?? null
		},

		async getExcursion(id: string) {
			return await excursionsApi.getExcursion(id);
		},

		async createExcursion(excursion: CreateExcursionDto): Promise<void> {
			return await excursionsApi.createExcursion(excursion);
		},

		async editExcursion(excursion: EditExcursionDto): Promise<EditExcursionDto> {
			return await excursionsApi.editExcursion(excursion);
		},

		async deleteExcursion(id: string): Promise<void> {
			await excursionsApi.deleteExcursion(id);
		},

		async getCitiesList(): Promise<void> {
			this.citiesList = await excursionsApi.getCitiesList();
		},

		async getTypesList(): Promise<void> {
			this.typesList = await excursionsApi.getTypesList();
		}
	}
});
