import { defineStore } from 'pinia';
import type { IExcursion } from './types';
import { getExcursions, getExcursion, createExcursion, uploadFiles, deleteExcursion } from '../api/api';

export const useExcursionStore = defineStore('useExcursionStore', {
	state: () => ({
		excursions: [] as IExcursion[],
		excursion: {} as IExcursion,
		cityList: [] as SelectItem[]
	}),
	actions: {
		async getExcursions(params?: any): Promise<void> {
			this.excursions = await getExcursions(params);
		},

		async getExcursion(id: string): Promise<void> {
			this.excursion = await getExcursion(id);
		},

		async createExcursion(excursion: IExcursion): Promise<void> {
			await createExcursion(excursion);
		},

		async deleteExcursion(id: string): Promise<void> {
			await deleteExcursion(id);
		},

		async uploadFiles(Files: FormData, path: string): Promise<void> {
			await uploadFiles(Files, path);
		}
	}
});
