import { useEffect, useRef } from 'react';

/**
 * 初始化hook
 *
 * 此hook中的初始化函数会立即初始化，且只执行一次
 */
export function useInit<T>(fn: () => T): T {
  const ref = useRef<T | null>(null);
  if (ref.current === null) {
    ref.current = fn();
  }
  return ref.current;
}

/**
 * 初始化hook
 *
 * 此hook中的初始化函数会在子组件初始化完毕之后初始化，只执行一次
 */
export function useInitAfterChildren(fn: () => void): void {
  useEffect(() => {
    fn();
  }, []);
}
