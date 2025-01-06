import { fetchApi } from '@/shared/api';
import type { ITour } from '../model/types';

/**
 * Retrieves a list of tours from the server.
 * @param params - Optional query parameters for the request.
 * @returns A promise that resolves to an array of ITour objects.
 * @throws If the request fails, the promise is rejected with an error.
 */
export const getTours = async (
	params?: Record<string, string | number | boolean>
): Promise<ITour[]> => {
	try {
		const response = await fetchApi.get('/hotels', params);
		return response;
	} catch (err: any) {
		console.error(err);
		throw err;
	}
};

/**
 * Retrieves a single tour from the server.
 * @param id - The ID of the tour.
 * @returns A promise that resolves to an ITour object.
 * @throws If the request fails, the promise is rejected with an error.
 */
export const getTour = async (id: string): Promise<ITour> => {
	try {
		const response: ITour = await fetchApi.get('/hotels/' + id);
		return response;
	} catch (err: any) {
		console.error(err);
		throw err;
	}
};

/**
 * Edits an tour on the server.
 * @param tour - The ITour object containing the updated data.
 * @returns A promise that resolves to the JSON response from the server if the request succeeds, or rejects with an error if the request fails.
 * @throws If the request fails, the promise is rejected with an error.
 */
export const editTour = async (tour: ITour): Promise<JSON | Error> => {
	// Construct the URL for the API endpoint.
	const url = `/hotels/${tour._id}`;

	// Send the request to the server.
	return await fetchApi.put(url, tour);
};

/**
 * Retrieves a single tour from the server.
 * @param tour - The ITour object containing the create data.
 * @returns A promise that resolves to an ITour object.
 * @throws If the request fails, the promise is rejected with an error.
 */
export const createTour = async (tour: ITour): Promise<void | JSON | Error> => {
	return await fetchApi.post('/hotels', tour);
};

/**
 * Retrieves a single tour from the server.
 * @param id - The ID of the tour.
 * @returns A promise that resolves to an ITour object.
 * @throws If the request fails, the promise is rejected with an error.
 */
export const deleteTour = async (id: string): Promise<void> => {
	try {
		await fetchApi.delete('/hotels/' + id);
	} catch (err: any) {
		console.error(err);
		throw err;
	}
};

/**
 * Uploads files to the server.
 * @param File - The files to upload.
 * @returns A promise that resolves when the files are uploaded.
 * @throws If the request fails, the promise is rejected with an error.
 */
export const uploadFile = async (
	File: FormData,
): Promise<string> => {
	try {
		const res: string = await fetchApi.upload('/s3/upload', File);
		return res;
	} catch (err: any) {
		console.error(err);
		throw err;
	}
};

/**
 * Uploads files to the server.
 * @param fileName - The file name to upload.
 * @returns A promise that resolves when the files are uploaded.
 * @throws If the request fails, the promise is rejected with an error.
 */
export const getFile = async (
	fileName: string,
): Promise<File> => {
	try {
		const res: File = await fetchApi.download(`/s3/download/`, fileName);
		return res;
	} catch (err: any) {
		console.error(err);
		throw err;
	}
};
