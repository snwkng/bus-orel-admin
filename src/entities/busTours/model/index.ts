import { defineStore } from 'pinia';
import type { ITour } from './types';
import { busToursApi } from '../api';

export const useBusTourStore = defineStore('useBusTourStore', {
	state: () => ({
		tours: [] as ITour[],
		files: [] as File[],
		citiesList: [] as SelectItem[]
	}),
	actions: {
		async getTours(params?: any): Promise<void> {
			this.tours = await busToursApi.getTours(params);
		},

		async getTour(id: string): Promise<ITour> {
			return await busToursApi.getTour(id);
		},

		async createTour(tour: ITour): Promise<void | Error> {
			await busToursApi.createTour(tour);
		},

		async editTour(tour: ITour): Promise<void | Error> {
			await busToursApi.editTour(tour);
		},

		async deleteTour(id: string): Promise<void> {
			await busToursApi.deleteTour(id);
		},

		async uploadFile(Files: FormData): Promise<string> {
			const res = await busToursApi.uploadFile(Files);
			return res;
		},

		async getFile(
			fileName: string,
		): Promise<File> {
			return await busToursApi.getFile(fileName);
		},

		async deleteFile(
			fileName: string,
		): Promise<boolean> {
			return await busToursApi.deleteFile(fileName);
		},

		async getCitiesList(): Promise<void> {
			const res = await busToursApi.getCitiesList();
			this.citiesList = res;
		}
	}
});
