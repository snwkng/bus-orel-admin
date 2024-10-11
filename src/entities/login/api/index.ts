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
    const res = await fetchApi.post('/auth/login', {username, password});
    if ('access_token' in res) {
      return res.access_token as string;
    } else {
      throw new Error('Access token not found in response');
    }
  } catch (err: unknown) {
    console.error(err as Error);
    throw err;
  }
};