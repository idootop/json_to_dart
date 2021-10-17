/* eslint-disable no-param-reassign */

import { isString } from './is';
import { isIntString } from './regex';
import { toInt } from './transform';

export type LDate = number | string | Date;

/**
 * 延时函数，单位毫秒
 */
export async function delay(time: number): Promise<void> {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
}

/**
 * 当前时间（Date）
 */
export const nowTime = (): Date => {
  return new Date();
};

/**
 * 当前时间戳（millisecondsSinceEpoch）
 *
 * 示例：1568259372000
 */
export function nowTimeStamp(): number {
  return toTimeStamp(nowTime());
}

/**
 * Date/字符串转时间戳（millisecondsSinceEpoch）
 */
export function toTimeStamp(time: LDate): number {
  return Date.parse(toDate(time).toString());
}

/**
 * 时间戳/字符串转Date
 */
export function toDate(time: LDate): Date {
  if (isString(time) && isIntString(time as string)) {
    const timestamp = toInt(time as string) as number;
    return new Date(timestamp);
  }
  return new Date(time);
}

/**
 * 根据日期判断今天周几
 */
export const getDateWeek = (date: LDate = nowTime()): string => {
  let weekDay = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  let myDate = toDate(date);
  return weekDay[myDate.getDay()];
};

/**
 * 判断两个日期相差几天
 *
 * 注意：此方法计算的是两日期相隔时间以天数为单位，并非自然日跨度
 */
export const dateDiffer = (endDate: LDate, startDate: LDate): number => {
  const differ = toTimeStamp(endDate) - toTimeStamp(startDate);
  return Math.ceil(differ / (1000 * 60 * 60 * 24));
};

/**
 * 格式化时间
 */
export const formatDate = (date: LDate = nowTime(), fmt = 'yyyy-MM-dd hh:mm:ss'): string => {
  date = toDate(date);
  const o: any = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'h+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    S: date.getMilliseconds(), // 毫秒
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, String(date.getFullYear()).substr(4 - RegExp.$1.length));
  }
  for (const k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(String(o[k]).length),
      );
    }
  }
  return fmt;
};
