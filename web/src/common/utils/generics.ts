import { Merge } from 'type-fest';

/**
 * 把对象的某个属性置为必选
 */
export type RequiredOne<T, K extends keyof T> = Merge<Omit<T, K>, Required<Pick<T, K>>>;

/**
 * 把对象的某个属性置为可选
 */
export type OptionalOne<T, K extends keyof T> = Merge<Omit<T, K>, Partial<Pick<T, K>>>;
