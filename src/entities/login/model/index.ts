import { defineStore } from 'pinia';
import { fetchApi } from '@/shared/api';

export const useLoginStore = defineStore('useLoginStore', {
  state: () => ({
    token: null as (string | null)
  }),
  getters: {
    isLoggedIn: (state) => !!state.token || !!localStorage.getItem('token'),
  },
  actions: {
    /**
     * Атунтификация пользователя.
     * @param {string} username логин
     * @param {string} password пароль
     * @returns возвращает токен
     * @throws ошибку если что-то пошло не так
     */
    async login(username: string, password: string): Promise<void> {
      try {
        const res = await fetchApi.post<{ access_token: string; }>('/auth/login', { username, password });
        if (res && 'access_token' in res) {
          localStorage.setItem('token', res.access_token);
          fetchApi.updateToken(res.access_token);
          this.token = res.access_token;
        } else {
          throw new Error('Access token not found in response');
        }
      } catch (err: unknown) {
        console.error(err as Error);
        throw err;
      }
    },
  }
});
