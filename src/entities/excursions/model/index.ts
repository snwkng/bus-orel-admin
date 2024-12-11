import { defineStore } from 'pinia';
import type { IExcursion } from './types';
import {
	getExcursions,
	getExcursion,
	createExcursion,
	editExcursion,
	uploadFile,
	deleteExcursion,
	getFile
} from '../api';

export const useExcursionStore = defineStore('useExcursionStore', {
	state: () => ({
		excursions: [] as IExcursion[],
		files: [] as File[]
	}),
	actions: {
		async getExcursions(params?: any): Promise<void> {
			this.excursions = await getExcursions(params);
		},

		async getExcursion(id: string): Promise<IExcursion> {
			return await getExcursion(id);
		},

		async createExcursion(excursion: IExcursion): Promise<void | Error> {
			await createExcursion(excursion);
		},

		async editExcursion(excursion: IExcursion): Promise<void | Error> {
			await editExcursion(excursion);
		},

		async deleteExcursion(id: string): Promise<void> {
			await deleteExcursion(id);
		},

		async uploadFile(Files: FormData): Promise<string> {
			const res = await uploadFile(Files);
			return res;
		},

		async getFile(
			fileName: string,
		): Promise<File> {
			return await getFile(fileName);
		}
	}
});
