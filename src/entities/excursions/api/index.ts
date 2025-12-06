import { api } from '@/shared/lib/api/api';
import type { IExcursion } from '../model/types';

export const excursionsApi = {
  getExcursions: async (
    params?: Record<string, string | number | boolean>
  ): Promise<IExcursion[]> => {
    try {
      const response = await api.get<IExcursion[]>('/api/admin/excursions', { params });
      return response?.data;
    } catch (err: any) {
      console.error(err);
      throw err;
    }
  },

  getCitiesList: async (): Promise<SelectItem[]> => {
    try {
      const response = await api.get<SelectItem[]>('/api/admin/excursions/cities-list');
      return response?.data;
    } catch (err: any) {
      console.error(err);
      throw err;
    }
  },

  getExcursion: async (id: string): Promise<IExcursion> => {
    try {
      const response = await api.get<IExcursion>('/api/admin/excursions/' + id);
      return response?.data;
    } catch (err: any) {
      console.error(err);
      throw err;
    }
  },

  editExcursion: async (tour: IExcursion): Promise<IExcursion | JSON | Error> => {
    const url = `/api/admin/excursions/${tour._id}`;

    const response = await api.put<IExcursion>(url, tour);
    return response?.data;
  },

  createExcursion: async (tour: IExcursion): Promise<void | JSON | Error> => {
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
