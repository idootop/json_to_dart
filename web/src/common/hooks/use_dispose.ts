import { useEffect } from 'react';

/**
 * 组件销毁hook
 *
 * 父组件会比子组件先开始销毁
 */
export const useDispose: (fn: () => void) => void = (fn) => {
  useEffect(() => {
    return fn;
  }, []);
};

/**
 * 组件销毁hook
 *
 * 等全部子组件销毁完毕后才执行
 */
export function useDisposeAfterChildren(fn: () => void): void {
  useEffect(() => {
    return () => {
      setTimeout(() => {
        fn();
      }, 0);
    };
  }, []);
}
