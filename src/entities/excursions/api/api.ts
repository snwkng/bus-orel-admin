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
		const response: IExcursion = await fetchApi.get('/excursions/' + id);
		return response;
	} catch (err: any) {
		console.error(err);
		throw err;
	}
};

/**
 * Edits an excursion on the server.
 * @param excursion - The IExcursion object containing the updated data.
 * @returns A promise that resolves to the JSON response from the server if the request succeeds, or rejects with an error if the request fails.
 * @throws If the request fails, the promise is rejected with an error.
 */
export const editExcursion = async (excursion: IExcursion): Promise<JSON | Error> => {
	// Construct the URL for the API endpoint.
	const url = `/excursions/${excursion._id}`;

	// Send the request to the server.
	return await fetchApi.put(url, excursion);
};

/**
 * Retrieves a single excursion from the server.
 * @param id - The ID of the excursion.
 * @returns A promise that resolves to an IExcursion object.
 * @throws If the request fails, the promise is rejected with an error.
 */
export const createExcursion = async (excursion: IExcursion): Promise<JSON | Error> => {
	return await fetchApi.post('/excursions', excursion);
};

/**
 * Retrieves a single excursion from the server.
 * @param id - The ID of the excursion.
 * @returns A promise that resolves to an IExcursion object.
 * @throws If the request fails, the promise is rejected with an error.
 */
export const deleteExcursion = async (id: string): Promise<void> => {
	try {
		await fetchApi.delete('/excursions/' + id);
	} catch (err: any) {
		console.error(err);
		throw err;
	}
};

/**
 * Uploads files to the server.
 * @param Files - The files to upload.
 * @param path - The path to upload the files to.
 * @returns A promise that resolves when the files are uploaded.
 * @throws If the request fails, the promise is rejected with an error.
 */
export const uploadFiles = async (Files: FormData, path: string): Promise<void> => {
	try {
		await fetchApi.uploadFiles(`/file/upload?path=${path}`, Files);
	} catch (err: any) {
		console.error(err);
		throw err;
	}
};

/**
 * Uploads files to the server.
 * @param Files - The files to upload.
 * @param path - The path to upload the files to.
 * @returns A promise that resolves when the files are uploaded.
 * @throws If the request fails, the promise is rejected with an error.
 */
export const getFile = async (fileName: string, dir: 'docs' | 'images', type: 'excursions' | 'hotels'): Promise<File> => {
	try {
		return await fetchApi.getFile(`/file/download/`, fileName, dir, type);
	} catch (err: any) {
		console.error(err);
		throw err;
	}
};
