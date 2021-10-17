import { ReactNode, useMemo, useState } from 'react';

import { useDispose, useInit } from '../../hooks';
import { VoidCallback } from '../../utils';

// ! 注意：
// ! 1. 在使用useConsumer前，必须先使用useProvider注入依赖state
// ! 2. 禁止使用useProvider在不同位置注入相同state（key相同）
// !    因为useProvider会随组件销毁时主动销毁state，造成其他依赖当前state的组件出现空错误
// ! 3. 考虑到不同页面之间的路由顺序无法保证，此时需要格外关注不同页面间state的依赖关系。
// !    例如，首页与分享页面可能是平级的，我们不能在首页初始化分享页面的状态，
// !    因为如果我们直接访问分享页面时，其依赖的state尚未初始化注入，会造成空错误。
// !    可能的做法是：把state放到根页面，或者由首页统一分发路由

/**
 * 获取依赖state
 *
 * 若指定key对应的state不存在，则抛出异常
 */
export function findState<T>(key: string): T {
  const res = find<T>(key);
  if (res === undefined) {
    throw new Error(`State<${key}> 尚未初始化，请先初始化再使用`);
  }
  return res!;
}

/**
 * 注入依赖state
 *
 * 若指定key对应的state存在，则抛出异常
 */
export function putState(key: string, state: any): void {
  if (find(key) !== undefined) {
    throw new Error(`State<${key}> 已存在，请勿重复初始化`);
  }
  sc.set(key, {
    data: state,
    listeners: [],
  });
}

/**
 * 更新state
 *
 * 若指定key对应的state不存在，则抛出异常
 */
export function updateState(key: string, value: any): void {
  if (!sc.has(key)) {
    throw new Error(`State<${key}> 不存在或已销毁`);
  }
  const listeners = sc.get(key)!.listeners;
  sc.set(key, {
    data: value,
    listeners: listeners,
  });
  listeners.forEach((rebuild) => rebuild());
}

/**
 * 组件刷新hook
 *
 * 用于监听依赖state更新，自动刷新当前组件
 */
export function useListenToState(key: string): void {
  const rebuild = useRebuild();
  useInit(() => {
    addListener(key, rebuild);
  });
  useDispose(() => {
    removeListener(key, rebuild);
  });
}

/**
 * 重置全局states
 */
export function resetStates(): void {
  sc.clear();
}

/**
 * 释放state
 *
 * 若当前state不存在，或其listener不为空，则抛出异常
 */
export function removeState(key: string): void {
  if (!sc.has(key)) {
    throw new Error(`State<${key}> 不存在或已销毁`);
  }
  if (sc.get(key)!.listeners.length > 0) {
    throw new Error(`State<${key}> listeners 不为空，请先取消所有监听，再释放state`);
  }
  sc.delete(key);
}

export abstract class StateManager {
  /**
   * 当前state唯一标识
   */
  abstract get _key(): string;
  /**
   * 刷新state
   */
  update(): void {
    updateState(this._key, this);
  }
  /**
   * 销毁state
   *
   * @lastLine
   * @mustCall super.dispose();
   */
  dispose(): void {
    removeState(this._key);
  }
  /**
   * 初始化state
   *
   * @lastLine
   * @mustCall super.init();
   */
  init(): void {
    putState(this._key, this);
  }
}

/**
 * 自动初始化/销毁state
 */
export function useProvider(factory: () => StateManager): void {
  let stateControllor: StateManager;
  // 在子组件初始化之前注入依赖
  stateControllor = useInit(() => {
    const controllor = factory();
    controllor.init();
    return controllor;
  });
  // 在子组件dispose之后销毁依赖
  useDispose(() => {
    setTimeout(() => {
      stateControllor.dispose();
    }, 0);
  });
}

/**
 * 自动初始化/销毁states
 */
export function useProviders(factory: () => StateManager[]): void {
  let stateControllors: StateManager[];
  stateControllors = useInit(() => {
    const controllors = factory();
    controllors.forEach((c) => c.init());
    return controllors;
  });
  useDispose(() => {
    stateControllors.forEach((c) => c.dispose());
  });
}

/**
 * State消费者
 *
 * 在state初始化后，销毁前使用
 */
export function useConsumer<T extends StateManager>(props: {
  key: string;
  filter?: (state: T) => any;
  builder: (state: T) => ReactNode;
}): ReactNode {
  useListenToState(props.key);
  const state = findState<T>(props.key);
  const deps = props.filter?.call(null, state);
  const result = useMemo<ReactNode>(() => props.builder(state), [deps]);
  return props.filter === undefined ? props.builder(state) : result;
}

interface StateContainer {
  data: any;
  listeners: VoidCallback[];
}

/**
 * 全局状态容器 (States Container)
 */
const sc = new Map<string, StateContainer>();

function find<T>(key: string): T | undefined {
  return sc.has(key) ? sc.get(key)!.data : undefined;
}

function useRebuild(): VoidCallback {
  const [, setFlag] = useState(false);
  return () => setFlag((v) => !v);
}

function addListener(key: string, rebuild: VoidCallback): void {
  if (!sc.has(key)) {
    throw new Error(`State<${key}> 不存在或已销毁`);
  }
  const state = sc.get(key)!;
  const index = state.listeners.indexOf(rebuild);
  if (index > -1) {
    throw new Error(`State<${key}> rebuild 已存在`);
  }
  state.listeners.push(rebuild);
  sc.set(key, state);
}

function removeListener(key: string, rebuild: VoidCallback): void {
  if (!sc.has(key)) {
    throw new Error(`State<${key}> 不存在或已销毁`);
  }
  const state = sc.get(key)!;
  const index = state.listeners.indexOf(rebuild);
  if (index < 0) {
    throw new Error(`State<${key}> rebuild 不存在`);
  }
  state.listeners.splice(index, 1);
  sc.set(key, state);
}
