export const debounce = (callback: any, wait: number) => {
  let timeoutId: number | undefined = undefined;
  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      callback(...args);
    }, wait);
  };
}