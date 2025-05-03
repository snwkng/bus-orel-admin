export function handleError(err: unknown): never {
  if ((err as any)?.status === 401) {
    localStorage.removeItem('token');
    location.replace('/login');
  }
  throw err;
}