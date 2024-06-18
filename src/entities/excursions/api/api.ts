import { fetchApi } from '@/shared/api';
import type { IExcursion } from '../model/types';

/**
 * Retrieves a list of excursions from the server.
 * @param params - Optional query parameters for the request.
 * @returns A promise that resolves to an array of IExcursion objects.
 * @throws If the request fails, the promise is rejected with an error.
 */
export const getExcursions = async (
	params?: Record<string, string | number | boolean>
): Promise<IExcursion[]> => {
	try {
		const response = await fetchApi.get('/excursions', params);
		return response;
	} catch (err: any) {
		console.error(err);
		throw err;
	}
};

/**
 * Retrieves a single excursion from the server.
 * @param id - The ID of the excursion.
 * @returns A promise that resolves to an IExcursion object.
 * @throws If the request fails, the promise is rejected with an error.
 */
export const getExcursion = async (id: string): Promise<IExcursion> => {
	try {
		const response = await fetchApi.get('/excursions/' + id);
		return response;
	} catch (err: any) {
		console.error(err);
		throw err;
	}
};

/**
 * Retrieves a single excursion from the server.
 * @param id - The ID of the excursion.
 * @returns A promise that resolves to an IExcursion object.
 * @throws If the request fails, the promise is rejected with an error.
 */
export const createExcursion = async (excursion: IExcursion): Promise<void> => {
	try {
		await fetchApi.post('/excursion', excursion);
	} catch (err: any) {
		console.error(err);
		throw err;
	}
};
