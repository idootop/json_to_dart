/* eslint-disable no-param-reassign */

/**
 * 用b对象填充a对象中的空值
 */
export function combineAwithB<T extends Object>(a: T, b: T): T {
  let combined: T = {} as any;
  for (let key in a) {
    combined[key] = a[key] ?? b[key];
  }
  for (let key in b) {
    combined[key] = a[key] ?? b[key];
  }
  return combined;
}

/**
 * 判断元素类型
 */
export const elementType = (ele: any): string => {
  const typeStr = Object.prototype.toString.call(ele);
  const reg = /^\[object\s([A-Za-z]+)\]$/;
  reg.test(typeStr);
  return RegExp.$1.toLowerCase();
};

/**
 * 深拷贝
 * 参考: https://juejin.im/post/5d6aa4f96fb9a06b112ad5b1
 */
export function deepClone<T>(data: T, weakMap?: WeakMap<any, any>): T {
  weakMap ??= new WeakMap();
  const eleType = elementType(data);
  if (eleType === 'array') {
    let result = [] as any;
    for (let i in data) {
      result.push(deepClone(data[i]));
    }
    return result;
  } else if (eleType === 'object') {
    // 解决对象属性循环引用
    const cacheData = weakMap.get(data);
    if (cacheData) return cacheData;
    let result: { [index: string]: string } = {};
    // 这里可以考虑一下为什么set要在for循环之前
    weakMap.set(data, result);
    for (let i in data) {
      result[i] = deepClone(data[i], weakMap) as any;
    }
    return result as any;
  } else if (eleType === 'map') {
    let result = new Map();
    for (let [key, value] of data as any) {
      result.set(key, deepClone(value));
    }
    return result as any;
  } else if (eleType === 'set') {
    let result = new Set();
    for (let value of (data as any).values()) {
      result.add(deepClone(value));
    }
    return result as any;
  } else if (eleType === 'symbol') {
    return Object(Symbol.prototype.valueOf.call(data));
  } else if (eleType === 'date') {
    return new Date(data as any) as any;
  } else if (eleType === 'regexp') {
    const reFlags = /\w*$/;
    const result = new (data as any).constructor((data as any).source, reFlags.exec(data as any));
    result.lastIndex = (data as any).lastIndex;
    return result;
  } else {
    return data;
  }
}

/**
 * 数据类型树
 */
export const typeTree: (data: any) => any = (data) => {
  const eleType = elementType(data);
  if (eleType === 'array') {
    let result = [] as any;
    for (let i in data) {
      result.push(typeTree(data[i]));
    }
    return { type: eleType, value: result };
  } else if (eleType === 'object') {
    let result: { [index: string]: any } = {};
    for (let i in data) {
      result[i] = typeTree(data[i]);
    }
    return { type: eleType, value: result };
  } else if (eleType === 'map') {
    let result = [] as any;
    for (let [key, value] of data) {
      result.push([typeTree(key), typeTree(value)]);
    }
    return { type: eleType, value: result };
  } else if (eleType === 'set') {
    let result = [] as any;
    for (let value of data.values()) {
      result.push(typeTree(value));
    }
    return { type: eleType, value: result };
  } else if (eleType === 'symbol') {
    return { type: eleType, value: data.description };
  } else if (eleType === 'date') {
    return { type: eleType, value: data.getTime() };
  } else if (eleType === 'regexp') {
    return { type: eleType, value: [data.source, data.flags] };
  } else {
    return { type: eleType, value: data };
  }
};

/**
 * 解析数据类型树
 */
export const resolveTypeTree = ({ type, value }: { type: string; value: any }): any => {
  const data = value;
  if (type === 'array') {
    let result = [] as any;
    for (let i in data) {
      result.push(resolveTypeTree(data[i]));
    }
    return result;
  } else if (type === 'object') {
    let result: { [index: string]: any } = {};
    for (let i in data) {
      result[i] = resolveTypeTree(data[i]);
    }
    return result;
  } else if (type === 'map') {
    let result = new Map();
    for (let [k, v] of data) {
      result.set(resolveTypeTree(k), resolveTypeTree(v));
    }
    return result;
  } else if (type === 'set') {
    let result = new Set();
    for (let v of data.values()) {
      result.add(resolveTypeTree(v));
    }
    return result;
  } else if (type === 'symbol') {
    return Symbol(data);
  } else if (type === 'date') {
    return new Date(data);
  } else if (type === 'regexp') {
    return new RegExp(data[0], data[1]);
  } else {
    return data;
  }
};

/**
 * 两个对象是否相等
 * @param data1 对比项1
 * @param data2 对比项2
 */
export const deepEqual: (data1: any, data2: any) => boolean = (data1, data2) => {
  const eleType = elementType(data1);
  const eleType2 = elementType(data2);
  if (eleType !== eleType2) return false;
  if (eleType === 'array') {
    if (data1.length !== data2.length) return false;
    for (let i = 0; i < data1.length; i++) {
      if (!deepEqual(data1[i], data2[i])) return false;
    }
    return true;
  } else if (eleType === 'object') {
    for (let i in data1) {
      if (!deepEqual(data1[i], data2[i])) return false;
    }
    return true;
  } else if (eleType === 'map') {
    for (let [key, value] of data1) {
      if (!deepEqual(key, key)) return false;
      if (!deepEqual(value, value)) return false;
    }
    return true;
  } else if (eleType === 'set') {
    for (let value of data1.values()) {
      if (!deepEqual(value, value)) return false;
    }
    return true;
  } else if (eleType === 'symbol') {
    return data1.description === data2.description;
  } else if (eleType === 'date') {
    return data1.getTime() === data2.getTime();
  } else if (eleType === 'regexp') {
    return data1.source === data2.source && data1.flags === data2.flags;
  } else {
    return data1 === data2;
  }
};
