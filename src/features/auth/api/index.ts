import { api } from '@/shared/api/api';
import { saveAuthTokens } from '@/shared/api/auth-session';

export interface AuthResponse {
	access_token: string;
	refresh_token?: string;
}

/**
 * Аутентификация пользователя.
 * Сохраняет пару токенов в localStorage (см. auth-session).
 * @param username логин
 * @param password пароль
 * @returns access_token
 */
export const login = async (username: string, password: string): Promise<string> => {
	try {
		const res = await api.post<AuthResponse>('/api/auth/login', { username, password });
		if (!res.data?.access_token) {
			throw new Error('Access token not found in response');
		}

		const { access_token, refresh_token } = res.data;
		saveAuthTokens(access_token, refresh_token);

		return access_token;
	} catch (err) {
		console.error('[API] Login failed', err);
		throw err;
	}
};

/**
 * Инвалидация refresh-токена на сервере.
 * Ошибки не пробрасываются: локальный выход состоится в любом случае.
 */
export const logoutRequest = async (): Promise<void> => {
	try {
		await api.post<void>('/api/auth/logout');
	} catch (err) {
		console.warn('[API] Logout request failed', err);
	}
};
