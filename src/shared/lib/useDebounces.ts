export const debounce = (func: Function, delayMs: number = 1000) => {
  let timeout: ReturnType<typeof setTimeout>;

  return (...args: any[]) => {
    timeout = setTimeout(() => {
      clearTimeout(timeout);
      func(...args);
    }, delayMs);
  };
};