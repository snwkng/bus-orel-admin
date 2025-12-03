import { defineStore } from 'pinia';
import { login } from '../api'; // ← только API-методы
import { api } from '@/shared/lib/api/api';

interface User {
  _id: string;
  username: string;
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
  }),

  getters: {
    // ✅ Проверяем через localStorage — нет дублирования состояния
    isLoggedIn: () => {
      try {
        const raw = localStorage.getItem('token');
        if (!raw) return false;
        const state = JSON.parse(raw);
        const now = Date.now();
        return state?.accessToken && now < state.expiresAt;
      } catch {
        return false;
      }
    },
  },

  actions: {
    async loginAction(username: string, password: string): Promise<void> {
      await login(username, password);
      await this.fetchProfile();
    },

    async fetchProfile(): Promise<void> {
      try {
        const res = await api.get<{ _id: string; username: string }>('/api/users/profile');
        this.user = res.data;
      } catch (err) {
        console.error('[Store] Failed to fetch profile', err);
        this.logout();
        throw err;
      }
    },

    logout() {
      // localStorage.removeItem('token');
      // this.user = null;
    },

    async checkAuth(): Promise<boolean> {
      if (!this.isLoggedIn) return false;
      try {
        await this.fetchProfile();
        return true;
      } catch {
        this.logout();
        return false;
      }
    },
  },
});