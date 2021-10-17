/**
 * 生成随机数
 */
export const randomUUID: () => string = () => {
  let s: any = [];
  let hexDigits = '0123456789abcdef';
  for (let i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = '4';
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
  s[8] = s[13] = s[18] = s[23] = '-';
  return s.join('');
};

/**
 * 随机数
 */
export const randomInt = (maxNum = 1, minNum = 0): number =>
  Math.floor(Math.random() * (maxNum - minNum + 1) + minNum);

/**
 * 从数组中随机取出一个元素
 */
export function pickOne<T>(array: Array<any>): T {
  return array[randomInt(array.length - 1)];
}
