export const debounce = <A extends unknown[]>(
  func: (...args: A) => void,
  delayMs: number = 1000
) => {
  let timeout: ReturnType<typeof setTimeout>;

  return (...args: A) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func(...args);
    }, delayMs);
  };
};