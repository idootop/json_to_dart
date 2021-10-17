/* eslint-disable @typescript-eslint/no-unused-vars */
// @ts-nocheck

// todo 目前这两个方法是有问题的

/**
 * 函数防抖
 *
 * 连续多次调用函数只响应一次，直到超过指定时间后再次调用才会重新触发
 *
 * @param timeout 防抖毫秒数
 * @param immediate 是否立即响应
 */
export function debounce(func: Function, timeout: number, immediate = true): Function {
  let timer;

  return (...args) => {
    const deferred = (): void => {
      timer = null;
      func(...args);
    };

    timer && clearTimeout(timer);
    timer = setTimeout(deferred, timeout);
  };
}

/**
 * 函数节流
 *
 * 在指定时间内多次调用函数只响应一次
 *
 * @param timeout 节流毫秒数
 * @param immediate 是否立即响应
 */
export const throttle = (func: Function, timeout: number, immediate = true): Function => {
  let timer;

  return (...args) => {
    const deferred = (): void => {
      timer = null;
      func(...args);
    };

    if (!timer) timer = setTimeout(deferred, timeout);
  };
};
