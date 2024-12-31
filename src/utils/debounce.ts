/* eslint-disable @typescript-eslint/no-explicit-any */
export function debounce(func: any, delay: number) {
  let timeoutId: NodeJS.Timeout;

  return function (...args: any[]) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}
