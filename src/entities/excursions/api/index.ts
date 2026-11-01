import { api } from '@/shared/api/api';
import type { EditExcursionDto, CreateExcursionDto } from '../model/types';
import type { ApiResponse, SelectItem } from '@/shared/api/types';
import { omitMetaFields } from '@/shared/lib/omitMetaFields';

export const excursionsApi = {
  getExcursions: async (
    params?: Record<string, string | number | boolean>
  ): Promise<ApiResponse<EditExcursionDto[]>> => {
    return await api.get<EditExcursionDto[]>('/api/admin/excursions', { params });
  },

  getCitiesList: async (): Promise<SelectItem[]> => {
    const response = await api.get<SelectItem[]>('/api/admin/excursions/cities-list');
    return response.data;
  },

  getTypesList: async (): Promise<SelectItem[]> => {
    const response = await api.get<SelectItem[]>('/api/admin/excursions/types-list');
    return response.data;
  },

  getExcursion: async (id: string): Promise<EditExcursionDto> => {
    const response = await api.get<EditExcursionDto>('/api/admin/excursions/' + id);
    return response.data;
  },

  editExcursion: async (excursion: EditExcursionDto): Promise<EditExcursionDto> => {
    const url = `/api/admin/excursions/${excursion._id}`;

    const response = await api.put<EditExcursionDto>(url, omitMetaFields(excursion));
    return response.data;
  },

  createExcursion: async (excursion: CreateExcursionDto): Promise<void> => {
    await api.post<void>('/api/admin/excursions', excursion);
  },

  deleteExcursion: async (id: string): Promise<void> => {
    await api.delete('/api/admin/excursions/' + id);
  }
};
