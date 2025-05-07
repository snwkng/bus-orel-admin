import { fetchApi } from '@/shared/api';

/**
 * Атунтификация пользователя.
 * @param {string} username логин
 * @param {string} password пароль
 * @returns возвращает токен
 * @throws ошибку если что-то пошло не так
 */
export const login = async (username: string, password: string): Promise<string> => {
  try {
    const res = await fetchApi.post<{access_token: string}>('/auth/login', {username, password});
    if (res && 'access_token' in res) {
      localStorage.setItem('token', res.access_token);
      fetchApi.updateToken(res.access_token);
      return res.access_token;
    } else {
      throw new Error('Access token not found in response');
    }
  } catch (err: unknown) {
    console.error(err as Error);
    throw err;
  }
};