export const debounce = (func: Function, delayMs: number = 1000) => {
  let timeout: ReturnType<typeof setTimeout>;

  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func(...args);
    }, delayMs);
  };
};