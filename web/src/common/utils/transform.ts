import { isStringNumber } from './is';
import { isFloatString, isIntString } from './regex';

/**
 * obj => json string
 */
export function jsonEncode(obj: any): string | undefined {
  try {
    return JSON.stringify(obj);
  } catch (error) {
    return undefined;
  }
}

/**
 * json string => obj
 */
export function jsonDecode(json: string): any | undefined {
  try {
    return JSON.parse(json);
  } catch (error) {
    return undefined;
  }
}

/**
 * 字节数组转base64字符串
 */
export function bytesTobase64(buffer: ArrayBuffer): string {
  let binary = '';
  let bytes = new Uint8Array(buffer);
  let len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

/**
 * base64字符串转字节数组
 */
export function base64ToBytes(base64: string): ArrayBuffer {
  let binary_string = window.atob(base64);
  let len = binary_string.length;
  let bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes.buffer;
}

/**
 * '123' => 123
 */
export function toInt(str: string): number | undefined {
  if (!isIntString(str)) {
    return undefined;
  }
  return parseInt(str, 10);
}

/**
 * '1.0' => 1.0
 */
export function toFloat(str: string): number | undefined {
  if (!isFloatString(str)) {
    return undefined;
  }
  return parseFloat(str);
}

/**
 * '1.0' => 1.0
 */
export function toNumber(str: string): number | undefined {
  if (!isStringNumber(str)) {
    return undefined;
  }
  return parseFloat(str);
}

/**
 * obj => string
 */
export function toString(obj: Object): string {
  return obj.toString();
}
