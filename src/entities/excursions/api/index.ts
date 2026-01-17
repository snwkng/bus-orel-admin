import { api } from '@/shared/lib/api/api';
import type { EditExcursionDto, CreateExcursionDto } from '../model/types';

export const excursionsApi = {
  getExcursions: async (
    params?: Record<string, string | number | boolean>
  ): Promise<EditExcursionDto[]> => {
    try {
      const response = await api.get<EditExcursionDto[]>('/api/admin/excursions', { params });
      console.log(response.data)
      return response?.data;
    } catch (err: any) {
      console.error(err);
      throw err;
    }
  },

  getCitiesList: async (): Promise<SelectItem[]> => {
    try {
      const response = await api.get('/api/admin/excursions/cities-list');
      return response?.data as SelectItem[];
    } catch (err: any) {
      console.error(err);
      throw err;
    }
  },

  getExcursion: async (id: string): Promise<EditExcursionDto> => {
    try {
      const response = await api.get<EditExcursionDto>('/api/admin/excursions/' + id);
      return response?.data;
    } catch (err: any) {
      console.error(err);
      throw err;
    }
  },

  editExcursion: async (tour: EditExcursionDto): Promise<EditExcursionDto> => {
    const url = `/api/admin/excursions/${tour._id}`;

    const response = await api.put<EditExcursionDto>(url, tour);
    return response?.data;
  },

  createExcursion: async (tour: CreateExcursionDto): Promise<void> => {
    await api.post<void>('/api/admin/excursions', tour);
  },

  deleteExcursion: async (id: string): Promise<void> => {
    try {
      await api.delete('/api/admin/excursions/' + id);
    } catch (err: any) {
      console.error(err);
      throw err;
    }
  },

  uploadFile: async (
    File: FormData,
  ): Promise<string> => {
    try {
      const res: string = await api.upload('/api/admin/s3/upload', File);
      return res;
    } catch (err: any) {
      console.error(err);
      throw err;
    }
  },

  getFile: async (
    fileName: string,
  ): Promise<File> => {
    try {
      const res = await api.downloadBlob(`/api/s3/download/${fileName}`,);
      return new File([res], fileName);
    } catch (err: any) {
      console.error(err);
      throw err;
    }
  },

  deleteFile: async (
    fileName: string,
  ): Promise<boolean> => {
    try {
      const res = await api.delete<boolean>(`/api/admin/s3/delete?uuid=${fileName}`);
      return res?.data;
    } catch (err: any) {
      console.error(err);
      throw err;
    }
  }
};
