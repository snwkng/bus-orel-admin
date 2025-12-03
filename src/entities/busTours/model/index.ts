import { defineStore } from 'pinia';
import type { ITour } from './types';
import {
	getTours,
	createTour,
	editTour,
	uploadFile,
	getFile,
	deleteTour,
	deleteFile,
	getCitiesList,
	getTour
} from '../api';
import { fetchApi } from '@/shared/api';

export const useBusTourStore = defineStore('useBusTourStore', {
	state: () => ({
		tours: [] as ITour[],
		files: [] as File[],
		citiesList: [] as SelectItem[]
	}),
	actions: {
		async getTours(params?: any): Promise<void> {
			this.tours = await getTours(params);
		},

		async getTour(id: string): Promise<ITour> {
			return await getTour(id)
		},

		async createTour(tour: ITour): Promise<void | Error> {
			await createTour(tour);
		},

		async editTour(tour: ITour): Promise<void | Error> {
			await editTour(tour);
		},

		async deleteTour(id: string): Promise<void> {
			await deleteTour(id);
		},

		async uploadFile(Files: FormData): Promise<string> {
			const res = await uploadFile(Files);
			return res;
		},

		async getFile(
			fileName: string,
		): Promise<File> {
			return await getFile(fileName);
		},

		async deleteFile(
			fileName: string,
		): Promise<boolean> {
			return await deleteFile(fileName);
		},

		async getCitiesList(): Promise<void> {
			const res = await getCitiesList();
			this.citiesList = res;
		}
	}
});
