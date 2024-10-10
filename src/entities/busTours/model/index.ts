import { defineStore } from 'pinia';
import type { ITour } from './types';
import {
	getTours,
	getTour,
	createTour,
	editTour,
	uploadFiles,
	deleteTour,
	getFile
} from '../api/api';

export const useBusTourStore = defineStore('useBusTourStore', {
	state: () => ({
		tours: [] as ITour[],
		files: [] as File[]
	}),
	actions: {
		async getTours(params?: any): Promise<void> {
			this.tours = await getTours(params);
		},

		async getTour(id: string): Promise<ITour> {
			return await getTour(id);
		},

		async createTour(Tour: ITour): Promise<void | Error> {
			await createTour(Tour);
		},

		async editTour(Tour: ITour): Promise<void | Error> {
			await editTour(Tour);
		},

		async deleteTour(id: string): Promise<void> {
			await deleteTour(id);
		},

		async uploadFiles(Files: FormData, path: string): Promise<void> {
			await uploadFiles(Files, path);
		},

		async getFile(
			fileName: string,
			dir: FileDir,
			type: FileType
		): Promise<File> {
			return await getFile(fileName, dir, type);
		}
	}
});
