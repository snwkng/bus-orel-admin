import { defineStore } from 'pinia';
import { login } from '../api'; // ← только API-методы
import { api } from '@/shared/lib/api/api';
import router from '@/app/router';

interface User {
  _id: string;
  username: string;
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    token: localStorage.getItem('token'), 
  }),

  getters: {
    isLoggedIn: (state) => {
      if (!state.token) return false;
      try {
        const data = JSON.parse(state.token);
        // Проверка времени жизни
        return data?.accessToken && Date.now() < data.expiresAt;
      } catch {
        return false;
      }
    },
  },

  actions: {
    async loginAction(username: string, password: string): Promise<void> {
      await login(username, password);
      this.token = localStorage.getItem('token'); 
      await this.fetchProfile();
    },

    async fetchProfile(): Promise<void> {
      try {
        const res = await api.get<{ _id: string; username: string; }>('/api/users/profile');
        this.user = res.data;
        router.push({ name: 'home' });
      } catch (err) {
        console.error('[Store] Failed to fetch profile', err);
        this.logout();
        throw err;
      }
    },

    logout() {
      localStorage.removeItem('token');
      this.token = null;
      this.user = null;
      router.push({ name: 'login' });
    },
  },
});