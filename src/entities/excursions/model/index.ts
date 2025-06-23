import { defineStore } from 'pinia';
import type { IExcursion } from './types';
import { fetchApi } from '@/shared/api';

export const useExcursionStore = defineStore('useExcursionStore', {
	state: () => ({
		excursions: [] as IExcursion[],
		files: [] as File[],
		citiesList: [] as SelectItem[],
	}),
	actions: {
		async getExcursions(params?: Record<string, string | number | boolean>): Promise<void> {
			try {
				const response = await fetchApi.get<IExcursion[]>('/excursions', params);
				this.excursions = response;
			} catch (err: any) {
				console.error(err);
				throw err;
			}
		},

		async getExcursion(id: string): Promise<IExcursion> {
			try {
				const response = await fetchApi.get<IExcursion>('/excursions/' + id);
				return response;
			} catch (err: any) {
				console.error(err);
				throw err;
			}
		},

		async createExcursion(excursion: IExcursion): Promise<void | Error> {
			try {
				await fetchApi.post('/excursions', excursion);
			} catch (err: any) {
				console.error(err);
				throw err;
			}
		},

		async editExcursion(excursion: IExcursion): Promise<JSON | Error> {
			// Construct the URL for the API endpoint.
			const url = `/excursions/${excursion._id}`;
			// Send the request to the server.
			return await fetchApi.put(url, excursion);
		},

		async deleteExcursion(id: string): Promise<void> {
			try {
				await fetchApi.delete('/excursions/' + id);
			} catch (err: any) {
				console.error(err);
				throw err;
			}
		},

		async uploadFile(File: FormData): Promise<string> {
			try {
				const res: string = await fetchApi.upload('/s3/upload', File);
				return res;
			} catch (err: any) {
				console.error(err);
				throw err;
			}
		},

		async getFile(
			fileName: string,
		): Promise<File> {
			try {
				const res: File = await fetchApi.download(`/s3/download/`, fileName);
				return res;
			} catch (err: any) {
				console.error(err);
				throw err;
			}
		},

		async deleteFile(
			fileName: string,
		): Promise<boolean> {
			try {
				const res: boolean = await fetchApi.delete(`/s3/delete?uuid=${fileName}`);
				return res;
			} catch (err: any) {
				console.error(err);
				throw err;
			}
		},

		async getCitiesList(): Promise<void> {
			try {
				const response = await fetchApi.get<SelectItem[]>('/excursions/cities-list');
				this.citiesList = response;
			} catch (err: any) {
				console.error(err);
			}
		}
	}
});
