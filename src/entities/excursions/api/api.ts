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
    const response = await fetchApi.get(
      '/excursions',
      params
    );
    return response;
  } catch (err: any) {
    console.error(err);
    throw err;
  }
};
