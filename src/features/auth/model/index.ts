import { defineStore } from 'pinia';
import { login, logoutRequest } from '../api';
import { api } from '@/shared/api/api';
import {
	AUTH_STORAGE_KEY,
	clearAuthTokens,
	hasValidSession
} from '@/shared/api/auth-session';
import router from '@/app/router';

interface User {
  _id: string;
  username: string;
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    token: localStorage.getItem(AUTH_STORAGE_KEY),
  }),

  getters: {
    isLoggedIn: () => hasValidSession(),
  },

  actions: {
    async loginAction(username: string, password: string): Promise<void> {
      await login(username, password);
      this.token = localStorage.getItem(AUTH_STORAGE_KEY);
      await this.fetchProfile();
    },

    async fetchProfile(): Promise<void> {
      try {
        const res = await api.get<{ _id: string; username: string; }>('/api/users/profile');
        this.user = res.data;
      } catch (err) {
        // Не 401 (например, обрыв сети): сессию не трогаем, профиль подгрузится позже
        console.error('[Store] Failed to fetch profile', err);
      }
    },

    async logout() {
      await logoutRequest();
      clearAuthTokens();
      this.token = null;
      this.user = null;
      router.push({ name: 'login' });
    },
  },
});
