import { defineStore } from 'pinia';
import type { EditExcursionDto, CreateExcursionDto } from './types';
import { excursionsApi } from '../api';

export const useExcursionStore = defineStore('useExcursionStore', {
	state: () => ({
		excursions: [] as EditExcursionDto[],
		files: [] as File[],
		citiesList: [] as SelectItem[],
	}),
	actions: {
		async getExcursions(params?: Record<string, string | number | boolean>): Promise<void> {
			this.excursions = await excursionsApi.getExcursions(params);
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
			return await excursionsApi.uploadFile(file);
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
