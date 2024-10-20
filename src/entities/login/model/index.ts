import { defineStore } from 'pinia';
import { login } from '../api';

export const useLoginStore = defineStore('useLoginStore', {
	state: () => ({
		token: null as string | null
	}),
  getters: {
    isLoggedIn: (state) => !!state.token || !!localStorage.getItem('token'),
  },
	actions: {
		async login(username: string, password: string): Promise<void> {
			try {
        this.token = await login(username, password);
      } catch (error: unknown) {
        this.token = null;
        throw error;
      }
		},
	}
});
