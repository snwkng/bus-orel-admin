import { defineStore } from 'pinia';
import type { EditExcursionDto, CreateExcursionDto } from './types';
import { excursionsApi } from '../api';
import type { IPagination } from '@/shared/config/interfaces/pagination.interface';

export const useExcursionStore = defineStore('useExcursionStore', {
	state: () => <{
		excursions: EditExcursionDto[]
		pagination: null | IPagination,
		files: File[],
		citiesList: SelectItem[]
	}>({
		excursions: [],
		pagination: null,
		files: [],
		citiesList: [],
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

		async uploadFile(file: FormData): Promise<string> {
			const res = await excursionsApi.uploadFile(file);
			return res.data as string
		},

		async getFile(
			fileName: string,
		): Promise<File> {
			return await excursionsApi.getFile(fileName);
		},

		async deleteFile(
			fileName: string,
		): Promise<boolean> {
			return await excursionsApi.deleteFile(fileName);
		},

		async getCitiesList(): Promise<void> {
			this.citiesList = await excursionsApi.getCitiesList();
		}
	}
});
