import { defineStore } from 'pinia';
import { fetchApi } from '@/shared/api';

interface IState {
  user: null | { _id: string, username: string; };
  token: null | string;
}

export const useLoginStore = defineStore('useLoginStore', {
  state: (): IState => ({
    user: null,
    token: localStorage.getItem('token') || null,
  }),
  getters: {
    isLoggedIn: (state) => !!state.token
  },
  actions: {
    setToken(token: string) {
      this.token = token;
      localStorage.setItem('token', token);
    },
    removeToken() {
      this.token = null;
      this.user = null;
      localStorage.removeItem('token');
    },
    /**
     * Логин пользователя.
     * @param {string} username логин
     * @param {string} password пароль
     * @returns {void}
     * @throws 
     */
    async login(username: string, password: string): Promise<void> {
      try {
        const res = await fetchApi.post<{ access_token: string; }>('/auth/login', { username, password });
        if (res && 'access_token' in res) {
          fetchApi.updateToken(res.access_token);
          this.setToken(res.access_token);
        } else {
          throw new Error('Access token not found in response');
        }
      } catch (err: unknown) {
        console.error(err as Error);
        throw err;
      }
    },

    async checkAuth(): Promise<boolean> {
      try {
        const res = await fetchApi.get<{ _id: string, username: string; }>('/users/profile');
        this.user = res;
        return true;
      } catch (err) {
        this.removeToken();
        console.error(err);
        return false;
      }
    }
  }
});
