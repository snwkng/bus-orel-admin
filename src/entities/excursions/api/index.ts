import { api } from '@/shared/api/api';
import type { EditExcursionDto, CreateExcursionDto } from '../model/types';
import type { ApiResponse, SelectItem } from '@/shared/api/types';
import { omitMetaFields } from '@/shared/lib/omitMetaFields';

export const excursionsApi = {
  getExcursions: async (
    params?: Record<string, string | number | boolean>
  ): Promise<ApiResponse<EditExcursionDto[]>> => {
    try {
      const response = await api.get<EditExcursionDto[]>('/api/admin/excursions', { params });
      console.log(response.data);
      return response;
    } catch (err: unknown) {
      console.error(err);
      throw err;
    }
  },

  getCitiesList: async (): Promise<SelectItem[]> => {
    try {
      const response = await api.get('/api/admin/excursions/cities-list');
      return response?.data as SelectItem[];
    } catch (err: unknown) {
      console.error(err);
      throw err;
    }
  },

  getTypesList: async (): Promise<SelectItem[]> => {
    try {
      const response = await api.get('/api/admin/excursions/types-list');
      return response?.data as SelectItem[];
    } catch (err: unknown) {
      console.error(err);
      throw err;
    }
  },

  getExcursion: async (id: string): Promise<EditExcursionDto> => {
    try {
      const response = await api.get<EditExcursionDto>('/api/admin/excursions/' + id);
      return response?.data;
    } catch (err: unknown) {
      console.error(err);
      throw err;
    }
  },

  editExcursion: async (tour: EditExcursionDto): Promise<EditExcursionDto> => {
    const url = `/api/admin/excursions/${tour._id}`;

    const response = await api.put<EditExcursionDto>(url, omitMetaFields(tour));
    return response?.data;
  },

  createExcursion: async (tour: CreateExcursionDto): Promise<void> => {
    await api.post<void>('/api/admin/excursions', tour);
  },

  deleteExcursion: async (id: string): Promise<void> => {
    try {
      await api.delete('/api/admin/excursions/' + id);
    } catch (err: unknown) {
      console.error(err);
      throw err;
    }
  }
};
