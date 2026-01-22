import { api } from '@/shared/lib/api/api';

export interface AuthResponse {
  access_token: string;
  // Если бэкенд отдаёт expires_in — добавьте:
  // expires_in: number; // секунды
}

/**
 * Аутентификация пользователя.
 * Сохраняет токен в localStorage с метаданными (lastActive, expiresAt).
 * @param username логин
 * @param password пароль
 * @returns access_token
 */
export const login = async (username: string, password: string): Promise<string> => {
  try {
    const res = await api.post<AuthResponse>('/api/auth/login', { username, password });
    console.log(res)
    if (!res.data?.access_token) {
      throw new Error('Access token not found in response');
    }

    const { access_token } = res.data;
    
    // 🔐 Сохраняем сессию с защитой
    const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 часа
    const authState = {
      accessToken: access_token,
      lastActive: Date.now(),
      expiresAt,
    };
    localStorage.setItem('token', JSON.stringify(authState));

    return access_token;
  } catch (err) {
    console.error('[API] Login failed', err);
    throw err;
  }
};