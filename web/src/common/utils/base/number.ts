/* eslint-disable no-param-reassign */

/**
 * 高精度运算
 * 先将小数转换为整数,再除以位数
 */
export const calc = (num1: number, action: '+' | '-' | '*' | '/', num2: number): number => {
  const [int1, float1] = String(num1).split('.');
  const [int2, float2] = String(num2).split('.');
  // 小数点后位数
  const m = float1 ? float1.length : 0;
  const n = float2 ? float2.length : 0;
  const maxMultiple = Math.pow(10, Math.max(n, m));
  // 两个浮点数扩大相同倍数
  num1 = num1 * maxMultiple;
  num2 = num2 * maxMultiple;
  switch (action) {
    case '+':
      return (num1 + num2) / maxMultiple;
    case '-':
      return (num1 - num2) / maxMultiple;
    case '*':
      return (Number(int1 + (float1 || '')) * Number(int2 + (float2 || ''))) / Math.pow(10, m + n);
    case '/':
      return Number(int1 + (float1 || '')) / Number(int2 + (float2 || '')) / Math.pow(10, m + n);
    default:
      return (num1 + num2) / maxMultiple;
  }
};

/**
 * 数字转换为汉语大写
 */
export const covertNumberToChinese = (num: number): string => {
  const fraction = ['角', '分'];
  const digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
  const unit = [
    ['元', '万', '亿'],
    ['', '拾', '百', '仟'],
  ];
  let result = '';
  num = Math.abs(num);
  // 计算小数部分
  fraction.forEach((n, idx) => {
    // 右移动一位小数点
    const rightMovePoint = calc(num, '*', 10 * Math.pow(10, idx));
    // 取出移动前小数点后一位
    const pickNumber = Math.floor(rightMovePoint % 10);
    // 拼接小数部分字符串
    result = result + `${digit[pickNumber]}${n}`;
    // 处理字符串
    result = result.replace(/零./, '');
  });
  result = result || '整';
  // 处理整数部分
  num = Math.floor(num);
  for (let i = 0; i < unit[0].length && num > 0; i++) {
    let pattern = '';
    for (let j = 0; j < unit[1].length && num > 0; j++) {
      // 取出最后一位整数
      const lastDigitNumber = num % 10;
      pattern = `${digit[lastDigitNumber]}${unit[1][j]}` + pattern;
      num = Math.floor(num / 10);
    }
    // 消除中间的零佰零仟等
    result = pattern.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + result;
  }
  return result
    .replace(/(零.)*零元/, '元')
    .replace(/(零.)+/g, '零')
    .replace(/^整$/, '零元整');
};

/**
 * 数字分隔符表示
 * @example
 * ```
 * separateNumber(10000) => 10,000
 * separateNumber(10000, '|') => 10|000
 * separateNumber(10000, '|', 2) => 1|00|00
 * ```
 */
export const separateNumber = (num: number, separator = ',', digit = 3): string => {
  const reg = new RegExp(`(?!^)(?=(\\d{${digit}})+$)`, 'g');
  return num.toString().replace(reg, separator);
};
