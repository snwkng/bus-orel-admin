import { defineStore } from 'pinia';
import { fetchApi } from '@/shared/api';

export const useCityStore = defineStore('useCityStore', {
  state: () => ({
    cities: [] as SelectItem[],
  }),
  actions: {
    async getCities(): Promise<void> {
      try {
        this.cities = await fetchApi.get('/cities');
      } catch (err: any) {
        console.error(err);
        throw err;
      }
    },

    async addCity(name: string): Promise<SelectItem> {
      try {
        const city = await fetchApi.post('/cities', { name });
        this.cities.push(city as SelectItem);
        return city as SelectItem;
      } catch (err: any) {
        console.error(err);
        throw err;
      }
    },
  }
});
