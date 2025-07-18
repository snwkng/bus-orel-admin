import { useLoginStore } from '@/entities/login/model';

export async function checkAuth(): Promise<boolean> {
  const { isLoggedIn, checkAuth } = useLoginStore();
  if (!isLoggedIn) return false;
  return await checkAuth();
}
