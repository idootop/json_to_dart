import { isHexColor } from '.';

interface RgbColor {
  r: number;
  g: number;
  b: number;
}

/**
 * 是否是明亮的颜色
 */
export function isLightColor(color: string): boolean {
  if (!isHexColor(color)) return false;
  const hex = color.replace('#', '');
  const c_r = parseInt(hex.substr(0, 2), 16);
  const c_g = parseInt(hex.substr(2, 2), 16);
  const c_b = parseInt(hex.substr(4, 2), 16);
  const brightness = (c_r * 299 + c_g * 587 + c_b * 114) / 1000;
  return brightness > 155;
}

/**
 * #rrggbb => (r,g,b)
 */
export function hexToRgb(hex: string): RgbColor | undefined {
  let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : undefined;
}

/**
 * (r,g,b) => #rrggbb
 */
export function rgbToHex(r: number, g: number, b: number): string {
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}
