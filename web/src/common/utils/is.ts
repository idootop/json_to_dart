import is from '@sindresorhus/is';

/**
 * 判断类型是否为空
 *
 * 当值为 null 或 undifined 时返回 true
 */
export function isNull(e: unknown): boolean {
  return is.nullOrUndefined(e);
}

/**
 * 判断数值是否为空
 *
 * 当值为 null、undifined 或空字符串/数组时返回 true
 */
export function isEmpty(e: unknown): boolean {
  return (
    isNull(e) ||
    is.emptyStringOrWhitespace(e) ||
    is.emptyArray(e) ||
    is.emptyMap(e) ||
    is.emptySet(e)
  );
}

/**
 * 判断数值是否非空
 *
 * 当值不为 null、undifined 或空字符串/数组/对象时返回 true
 */
export function isNotEmpty(e: unknown): boolean {
  return !isEmpty(e);
}

/**
 * 判断类型是否为number
 */
export function isNumber(e: unknown): boolean {
  return is.number(e);
}

/**
 * 判断类型是否为string
 */
export function isString(e: unknown): boolean {
  return is.string(e);
}

/**
 * 判断类型是否为string number
 */
export function isStringNumber(e: unknown): boolean {
  return is.numericString(e);
}

/**
 * 判断类型是否为array
 */
export function isArray(e: unknown): boolean {
  return is.array(e);
}

/**
 * 判断类型是否为object
 */
export function isObject(e: unknown): boolean {
  return is.object(e);
}

/**
 * 判断类型是否为Date
 */
export function isDate(e: unknown): boolean {
  return is.date(e);
}

/**
 * 获取类实例名称
 */
export function getClassName(obj: any): string {
  return obj.constructor.name;
}
