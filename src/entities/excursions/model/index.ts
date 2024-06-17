import { defineStore } from 'pinia'
import type { IExcursion } from './types';
import { getExcursions } from '../api/api';

export const useExcursionStore = defineStore('useExcursionStore', {
  state: () => ({
		excursions: [] as IExcursion[],
		excursion: {} as IExcursion,
		cityList: [] as SelectItem[]
	}),
	actions: {
		async getExcursions (params?: any): Promise<void> {
			this.excursions = await getExcursions(params)
		},

		// async getExcursion (id: string): Promise<void> {
		// 	const { BASE_URL } = useRuntimeConfig().public;
		// 	this.excursion = await fetch(`${BASE_URL}/excursions/${id}`)
		// },

		// async getCityList (): Promise<void> {
		// 	const { BASE_URL } = useRuntimeConfig().public;
		// 	this.cityList = await fetch(`${BASE_URL}/excursions/city-list`)
		// }
	}
})