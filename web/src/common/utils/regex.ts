/**
 * 判断是身份证
 */
export const isIdCard = (value: string): boolean =>
  /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/.test(
    value,
  );

/**
 * 判断是邮箱
 */
export const isEmail = (value: string): boolean =>
  /^[0-9A-Za-z]+(\.[0-9A-Za-z]+)?@[0-9A-Za-z]+(\.[0-9A-Za-z]+)?\.[A-Za-z]+/.test(value);

/**
 * 获取文件类型
 */
export const getFileExt = (fileName: string): string | undefined => {
  const ext = fileName.match(/\.([a-zA-Z]+)(?:[?#]|$)/g);
  return ext?.[0].toLowerCase();
};

/**
 * 判断是整数
 */
export function isIntString(s: string): boolean {
  return /^-?[1-9]\d*$/.test(s);
}

/**
 * 判断是浮点数
 */
export function isFloatString(s: string): boolean {
  return /^-?([1-9]\d*\.\d*|0\.\d*[1-9]\d*|0?\.0+|0)$/.test(s);
}

/**
 * 解析URL路径参数
 */
export function parseUrl(href: string): {
  href: string;
  protocol: string;
  host: string;
  hostname: string;
  port: string;
  pathname: string;
  search: string;
  hash: string;
} | null {
  const match = href.match(
    /^(https?:)\/\/(([^:/?#]*)(?::([0-9]+))?)([/]{0,1}[^?#]*)(\?[^#]*|)(#.*|)$/,
  );
  return (
    match && {
      href: href,
      protocol: match[1],
      host: match[2],
      hostname: match[3],
      port: match[4],
      pathname: match[5],
      search: match[6],
      hash: match[7],
    }
  );
}

/**
 * 判断是颜色（#rrggbb）
 */
export function isHexColor(s: string): boolean {
  return /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/.test(s);
}
