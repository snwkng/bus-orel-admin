import { defineStore } from 'pinia';
import type { IExcursion } from './types';
import { getExcursions, getExcursion, createExcursion } from '../api/api';

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
		}
	}
});
