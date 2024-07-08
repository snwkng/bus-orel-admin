import { defineStore } from 'pinia';
import type { IExcursion } from './types';
import { getExcursions, getExcursion, createExcursion, editExcursion, uploadFiles, deleteExcursion, getFile } from '../api/api';

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

		async uploadFiles(Files: FormData, path: string): Promise<void> {
			await uploadFiles(Files, path);
		},

		async getFile(fileName: string, dir: 'docs' | 'images', type: 'excursions' | 'hotels'): Promise<File> {
			return await getFile(fileName, dir, type);
		}
	}
});
