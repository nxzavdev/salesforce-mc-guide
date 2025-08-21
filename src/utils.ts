type AnyFunction = (...args: any[]) => any;
type ThrottledFunction<T extends AnyFunction> = (
  this: ThisParameterType<T>,
  ...args: Parameters<T>
) => void;

export function throttle<T extends AnyFunction>(
  func: T,
  limit: number
): ThrottledFunction<T> {
  let inThrottle = false;
  let lastFunc: ReturnType<typeof setTimeout>;
  let lastRan: number;

  return function(this: ThisParameterType<T>, ...args: Parameters<T>) {
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(() => {
        if (Date.now() - lastRan >= limit) {
          func.apply(context, args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
}
