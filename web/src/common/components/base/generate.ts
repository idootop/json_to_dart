import { Property } from 'csstype';
import React, { CSSProperties, ReactNode } from 'react';

import { px } from '../../services';
import {
  combineAwithB,
  isEmpty,
  isNotEmpty,
  isNumber,
  isString,
  isStringNumber,
  jsKeyToCssKey,
  OnClickEvent,
} from '../../utils';

export interface LBaseComponentProps {
  children: ReactNode;
  className: string;
  style: React.CSSProperties;
  onClick: () => void;
}

export interface LBaseComponentReturnProps {
  children: ReactNode;
  className: string;
  style: React.CSSProperties;
  onClick: (event: OnClickEvent) => void;
}

/**
 * 基础盒子样式，不包含定位（align）
 */
export interface LBaseViewProps {
  /**
   * 正方形大小
   */
  size: number | string;
  width: number | string;
  height: number | string;
  /**
   * 背景颜色
   *
   * 渐变色gradient不为空时，此参数无效
   */
  color: Property.Color;
  /**
   * 外边距
   *
   * ```typescript
   * margin={10} // => 全部边10px
   *
   * margin="10" // => 全部边10px
   *
   * margin="10 20" // => 上下边10px、左右边10px
   *
   * margin="10 20 30 40" // => 上10px、右20px、下30px、左40px
   *
   * margin={{
   *    top: 10 , //上10px
   *    horizontal: 10 , //水平10px
   * }}
   * ```
   */
  margin: number | string | Partial<LEdgeInsetProps>;
  /**
   * 内边距
   *
   * ```typescript
   * padding={10} // => 全部边10px
   *
   * padding="10" // => 全部边10px
   *
   * padding="10 20" // => 上下边10px、左右边10px
   *
   * padding="10 20 30 40" // => 上10px、右20px、下30px、左40px
   *
   * padding={{
   *    top: 10 , //上10px
   *    horizontal: 10 , //水平10px
   * }}
   * ```
   */
  padding: number | string | Partial<LEdgeInsetProps>;
  /**
   * 圆角
   *
   * ```typescript
   * radius={10} // => 全部边10px
   *
   * radius="10 20" // => 全部水平10px/竖直20px
   *
   * radius={{
   *    // 等价于topLeft/bottomLeft=10
   *    left: 10, // => 左侧10px
   *    topRight: "10 20" // => 右上角水平10px/竖直20px
   * }}
   * ```
   */
  radius: number | string | Partial<LRadiusSideProps>;
  /**
   * 边框
   *
   * ```typescript
   * border="10 solid red" // => 全部边、10px、红色、实边框
   *
   * border={{
   *    left: "10 dotted #fff", // => 左边、10px、白色、点边框
   *    top: "10 dashed rgba(255,255,255,60%)" // => 上边、10px、60%透明度白色、虚线边框
   * }}
   * ```
   */
  border: string | Partial<LSideProps>;
  /**
   * 阴影
   *
   * ```typescript
   * shadow="10 -20 red" // => X偏移10px、Y偏移-20px、红色外投影
   *
   * shadow={[
   *    "inset 10 -20 red", // => 内投影、X偏移10px、Y偏移-20px、红色
   *    "10 -20 30 #fff", // => X偏移10px、Y偏移-20px、模糊半径30px、白色外投影
   *    "10 -20 30 40 rgba(255,255,255,60%)", // => X偏移10px、Y偏移-20px、模糊半径30px、扩散半径40px、60%透明度白色外投影
   * ]}
   * ```
   */
  shadow: string | string[];
  /**
   * 透明度
   *
   * 取值范围：0-1
   */
  opacity: number;
  /**
   * 背景渐变色
   *
   * 注意：径向渐变、线性渐变不能相互叠加
   *
   * ```typescript
   * // 线性渐变
   * gradient="linear-gradient(45deg, red, blue)" // => 顺时针45度线性渐变、起red、止blue
   *
   * gradient="linear-gradient(90deg, red, red 60%, blue)" // => 顺时针90度线性渐变、起red、60%：red、止blue
   *
   * // 径向渐变
   * gradient={[
   *    "radial-gradient(#000, #fff)", // => 径向渐变、由中心向外扩散、起黑、止白
   *    "radial-gradient(red, red 60%, blue)", // => 径向渐变、由中心向外扩散、起red、60%：red、止blue
   *    "radial-gradient(farthest-corner at 10 20, #000, #fff)", // => 径向渐变、以左上角向右10px，向下20px为中心、向四周扩散、起黑、止白
   * ]}
   * ```
   */
  gradient: string | string[];
  overflow: Property.Overflow;
  backgroundClip: Property.BackgroundClip;
  unselectable: boolean;
  /**
   * 是否隐藏（保持组件大小占位，不影响布局）
   */
  hide: boolean;
  /**
   * 是否隐藏（组件大小为0，影响布局）
   */
  offstage: boolean;
}

/**
 * 生成基础盒子样式，不包含定位（align）
 */
export function generateBaseViewStyle(p: Partial<LBaseViewProps>): React.CSSProperties {
  const offstage = p.offstage ?? false ? { display: 'none' } : undefined;
  const visiable: any =
    p.hide ?? false
      ? {
          visibility: 'hidden',
        }
      : undefined;
  const padding = generateEdgeInsets(p.padding);
  const viewSize = generateSizeWidthPadding({
    size: p.size,
    width: p.width,
    height: p.height,
    padding: padding,
  });
  const border = generateBorder(p.border);
  const margin = generateEdgeInsets(p.margin);
  const radius = generateRadius(p.radius);
  const shadow = generateBoxShadow(p.shadow);
  const gradient = generateGradient(p.gradient);
  const unselectable = generateUnselectable(p.unselectable);
  return {
    ...offstage,
    ...visiable,
    ...viewSize,
    ...border,
    ...radius,
    ...shadow,
    ...gradient,
    ...unselectable,
    margin: margin,
    padding: padding,
    opacity: isNotEmpty(p.opacity) ? p.opacity : 1,
    overflow: isNotEmpty(p.overflow) ? p.overflow : 'hidden',
    backgroundColor: isNotEmpty(p.color) ? p.color : 'transparent',
    backgroundClip: isNotEmpty(p.backgroundClip) ? p.backgroundClip : 'padding-box',
  };
}

/**
 * 内容是否可选中
 */
export function generateUnselectable(unselectable = true): any {
  return unselectable
    ? {
        MozUserSelect: '-moz-none',
        KhtmlUserSelect: 'none',
        WebkitUserSelect: 'none',
        OUserSelect: 'none',
        UserSelect: 'none',
      }
    : undefined;
}

/**
 * 联合classNames
 */
export function combineClassNames(
  outer?: string,
  ...innerClassNames: string[]
): string | undefined {
  const inner = isNotEmpty(innerClassNames)
    ? innerClassNames.map((e) => e.trim()).join(' ')
    : undefined;
  return [inner, outer].join(' ');
}

/**
 * 内联样式（style）转string
 */
export function cssPropertiesToString(styles?: string | CSSProperties): string | undefined {
  if (isEmpty(styles)) return undefined;
  if (isString(styles)) return (styles as String).trim();
  let result = '';
  for (let key in styles as CSSProperties) {
    if (isNotEmpty(styles![key])) {
      result = `${result}${jsKeyToCssKey(key)}:${styles![key]};`;
    }
  }
  return result;
}

/**
 * 生成内联样式（style）=> string
 */
export function combineStyles(
  outerStyle?: string | React.CSSProperties,
  ...innerStyles: (string | React.CSSProperties)[]
): string | undefined {
  const outer = cssPropertiesToString(outerStyle);
  const inner = innerStyles.map(cssPropertiesToString).join('');
  // outer的优先级高于inner，所以放在后面
  return [inner, outer].join(''); // join方法会自动忽略列表中空项
}

/**
 * 基础字体样式
 */
export interface LTextStyle {
  size: number;
  height: number;
  maxLines: number;
  weight: Property.FontWeight | string;
  color: Property.Color;
  opacity: number;
  overflow: Property.TextOverflow;
  wordBreak: Property.WordBreak;
  /**
   * 字符间距
   */
  letterSpacing: number;
  /**
   * 单词间距
   */
  wordSpacing: number;
  /**
   * 阴影
   *
   * ```typescript
   * shadow="10 -20 red" // => X偏移10px、Y偏移-20px、红色外投影
   *
   * shadow={[
   *    "10 -20 #fff", // => X偏移10px、Y偏移-20px、白色外投影
   *    "10 -20 30 rgba(255,255,255,60%)", // => X偏移10px、Y偏移-20px、模糊半径30px、60%透明度白色外投影
   * ]}
   * ```
   */
  shadow: string | string[];
}

/**
 * 生成基础字体样式
 */
export function generateTextStyle(p: Partial<LTextStyle>): React.CSSProperties {
  const size = px(p.size ?? 32);
  // 默认1.5倍行距
  const lineHeight = px(1.5 * (p.size ?? 32));
  const shadow = generateTextShadow(p.shadow);
  return {
    fontSize: size,
    textShadow: shadow,
    display: '-webkit-box',
    whiteSpace: 'normal',
    WebkitBoxOrient: 'vertical',
    opacity: isNotEmpty(p.opacity) ? p.opacity : 1,
    lineHeight: isNotEmpty(p.height) ? px(p.height) : lineHeight,
    WebkitLineClamp: isNotEmpty(p.maxLines) ? p.maxLines : 'none',
    fontWeight: isNotEmpty(p.weight) ? (p.weight as any) : 'normal',
    color: isNotEmpty(p.color) ? p.color : 'black',
    overflow: isNotEmpty(p.overflow) ? p.overflow : 'ellipsis',
    wordBreak: isNotEmpty(p.wordBreak) ? p.wordBreak : 'break-all',
    letterSpacing: isNotEmpty(p.letterSpacing) ? px(p.letterSpacing) : 'normal',
    wordSpacing: isNotEmpty(p.wordSpacing) ? px(p.wordSpacing) : 'normal',
  };
}

export function generateHintTextStyleStr(
  hintStyle: Partial<LTextStyle>,
  textStyle: Partial<LTextStyle>,
): string {
  let combinedHintStyle = combineAwithB(hintStyle, textStyle);
  const realHintStyle = generateTextStyle(combinedHintStyle);
  return cssPropertiesToString(realHintStyle) ?? '';
}

export interface LSizeProps {
  with: string;
  height: string;
  maxWidth: string;
  maxHeight: string;
  minWidth: string;
  minHeight: string;
}

/**
 * 生成尺寸（width/height）
 */
export function generateSizeWidthPadding(p: {
  size?: number | string;
  width?: number | string;
  height?: number | string;
  padding?: string;
}): Partial<LSizeProps> {
  const { size, width, height, padding } = p;
  if (padding === undefined) {
    return isNotEmpty(size)
      ? {
          with: px(size),
          height: px(size),
          maxWidth: px(size),
          maxHeight: px(size),
          minWidth: px(size),
          minHeight: px(size),
        }
      : {
          with: px(width),
          height: px(height),
          maxWidth: px(width),
          maxHeight: px(height),
          minWidth: px(width),
          minHeight: px(height),
        };
  }
  const [top, right, bottom, left] = padding!.split(' ');
  const sw = size === undefined ? undefined : `calc(${px(size)} - ${left} - ${right})`;
  const sh = size === undefined ? undefined : `calc(${px(size)} - ${top} - ${bottom})`;
  const w = width === undefined ? undefined : `calc(${px(width)} - ${left} - ${right})`;
  const h = height === undefined ? undefined : `calc(${px(height)} - ${top} - ${bottom})`;
  return isNotEmpty(size)
    ? {
        with: sw,
        height: sh,
        maxWidth: sw,
        maxHeight: sh,
        minWidth: sw,
        minHeight: sh,
      }
    : {
        with: w,
        height: h,
        maxWidth: w,
        maxHeight: h,
        minWidth: w,
        minHeight: h,
      };
}

export interface LEdgeInsetProps {
  left: number | string;
  right: number | string;
  top: number | string;
  bottom: number | string;
  vertical: number | string;
  horizontal: number | string;
}

/**
 * 生成一个边距（EdgeInset）
 */
export function pickOneEdgeInset(
  side: LSideTypes,
  value?: number | string,
): Partial<LEdgeInsetProps> {
  const noInset = {};
  if (isEmpty(value)) return noInset;
  const inset = px(value);
  switch (side) {
    case 'vertical':
      return {
        top: inset,
        bottom: inset,
      };
    case 'horizontal':
      return {
        left: inset,
        right: inset,
      };
    case 'top':
      return {
        top: inset,
      };
    case 'bottom':
      return {
        bottom: inset,
      };
    case 'left':
      return {
        left: inset,
      };
    case 'right':
      return {
        right: inset,
      };
    default:
      return noInset;
  }
}

/**
 * 生成边界间隔（padding/margin）
 */
export function generateEdgeInsets(
  edges?: number | string | Partial<LEdgeInsetProps>,
): string | undefined {
  if (isEmpty(edges)) return undefined;
  if (isString(edges) || isNumber(edges)) {
    const result = edges!.toString().trim().split(' ');
    if (![1, 2, 4].includes(result.length)) return undefined;
    if (result.length === 1) {
      return Array(4).fill(px(result[0])).join(' ');
    }
    if (result.length === 2) {
      const v = px(result[0]);
      const h = px(result[1]);
      return [v, h, v, h].join(' ');
    }
    return result.map(px).join(' ');
  }
  let p: Partial<LEdgeInsetProps> = {};
  let key: keyof Partial<LEdgeInsetProps>;
  for (key in edges as Partial<LEdgeInsetProps>) {
    let edge = pickOneEdgeInset(key, edges![key]);
    p = { ...p, ...edge };
  }
  return [p.top, p.right, p.bottom, p.left].map((e) => e ?? '0').join(' ');
}

export type LAlignTypes =
  | 'center'
  | 'topLeft'
  | 'topRight'
  | 'bottomLeft'
  | 'bottomRight'
  | 'centerLeft'
  | 'centerRight'
  | 'topCenter'
  | 'bottomCenter';

export interface LAlignStyles {
  display: Property.Display;
  flexDirection: Property.FlexDirection;
  alignItems: Property.AlignItems;
  justifyContent: Property.JustifyContent;
}

/**
 * 生成对齐方式（align）
 */
export function generateAlign(align?: LAlignTypes): Partial<LAlignStyles> {
  const baseStyle: Partial<LAlignStyles> = {
    flexDirection: 'row',
    display: 'flex',
  };
  const center = {
    ...baseStyle,
    alignItems: 'center', // cross top/bottom
    justifyContent: 'center', // main left/right
  };
  if (isEmpty(align)) return center;
  switch (align) {
    case 'topLeft':
      return {
        ...baseStyle,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
      };
    case 'topRight':
      return {
        ...baseStyle,
        alignItems: 'flex-start',
        justifyContent: 'flex-end',
      };
    case 'bottomLeft':
      return {
        ...baseStyle,
        alignItems: 'flex-end',
        justifyContent: 'flex-start',
      };
    case 'bottomRight':
      return {
        ...baseStyle,
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
      };
    case 'centerLeft':
      return {
        ...baseStyle,
        alignItems: 'center',
        justifyContent: 'flex-stert',
      };
    case 'centerRight':
      return {
        ...baseStyle,
        alignItems: 'center',
        justifyContent: 'flex-end',
      };
    case 'topCenter':
      return {
        ...baseStyle,
        alignItems: 'flex-start',
        justifyContent: 'center',
      };
    case 'bottomCenter':
      return {
        ...baseStyle,
        alignItems: 'flex-end',
        justifyContent: 'center',
      };
    case 'center':
    default:
      return center;
  }
}

export interface LBorderProps {
  borderTop: string;
  borderRight: string;
  borderBottom: string;
  borderLeft: string;
}

export interface LSideProps {
  left: string;
  right: string;
  top: string;
  bottom: string;
  vertical: string;
  horizontal: string;
}

export type LSideTypes = 'all' | 'left' | 'right' | 'top' | 'bottom' | 'vertical' | 'horizontal';

/**
 * 生成一条边框（border）
 */
export function pickOneBorder(side: LSideTypes, border?: string): Partial<LBorderProps> {
  const noBorder = {};
  if (isEmpty(border)) return noBorder;
  const borderProps = border!.trim().split(' ');
  if (borderProps.length !== 3) return noBorder;
  const borderStr = [px(borderProps[0]), ...borderProps.slice(1)].join(' ');
  switch (side) {
    case 'all':
      return {
        borderTop: borderStr,
        borderRight: borderStr,
        borderBottom: borderStr,
        borderLeft: borderStr,
      };
    case 'vertical':
      return {
        borderTop: borderStr,
        borderBottom: borderStr,
      };
    case 'horizontal':
      return {
        borderRight: borderStr,
        borderLeft: borderStr,
      };
    case 'top':
      return {
        borderTop: borderStr,
      };
    case 'bottom':
      return {
        borderBottom: borderStr,
      };
    case 'left':
      return {
        borderLeft: borderStr,
      };
    case 'right':
      return {
        borderRight: borderStr,
      };
    default:
      return noBorder;
  }
}

/**
 * 生成边框（border）
 */
export function generateBorder(borders?: string | Partial<LSideProps>): Partial<LBorderProps> {
  const noBorder = {};
  if (isEmpty(borders)) return noBorder;
  if (isString(borders)) {
    return pickOneBorder('all', borders as string);
  }
  let result: Partial<LBorderProps> = {};
  let key: keyof Partial<LSideProps>;
  for (key in borders as Partial<LSideProps>) {
    let border = pickOneBorder(key, borders![key]);
    result = { ...result, ...border };
  }
  return result;
}

export interface LRadiusStyles {
  borderTopLeftRadius: string;
  borderTopRightRadius: string;
  borderBottomLeftRadius: string;
  borderBottomRightRadius: string;
}

export interface LRadiusSideProps {
  left: number | string;
  right: number | string;
  top: number | string;
  bottom: number | string;
  topLeft: number | string;
  topRight: number | string;
  bottomLeft: number | string;
  bottomRight: number | string;
}

export type LRadiusSideTypes =
  | 'left'
  | 'right'
  | 'top'
  | 'bottom'
  | 'topLeft'
  | 'topRight'
  | 'bottomLeft'
  | 'bottomRight';

/**
 * 生成一个圆角（radius）
 */
export function pickOneRadius(
  side: LRadiusSideTypes,
  radius?: string | number,
): Partial<LRadiusStyles> {
  const noRadius = {};
  if (isEmpty(radius)) return noRadius;
  const radiusProps = radius!.toString().trim().split(' ');
  if (![1, 2].includes(radiusProps.length)) return noRadius;
  const radiusStr = radiusProps.map(px).join(' ');
  switch (side) {
    case 'left':
      return {
        borderTopLeftRadius: radiusStr,
        borderBottomLeftRadius: radiusStr,
      };
    case 'right':
      return {
        borderTopRightRadius: radiusStr,
        borderBottomRightRadius: radiusStr,
      };
    case 'top':
      return {
        borderTopLeftRadius: radiusStr,
        borderTopRightRadius: radiusStr,
      };
    case 'bottom':
      return {
        borderBottomLeftRadius: radiusStr,
        borderBottomRightRadius: radiusStr,
      };
    case 'topLeft':
      return {
        borderTopLeftRadius: radiusStr,
      };
    case 'topRight':
      return {
        borderTopRightRadius: radiusStr,
      };
    case 'bottomLeft':
      return {
        borderBottomLeftRadius: radiusStr,
      };
    case 'bottomRight':
      return {
        borderBottomRightRadius: radiusStr,
      };
    default:
      return noRadius;
  }
}

/**
 * 生成圆角（radius）
 */
export function generateRadius(
  radiuses?: number | string | Partial<LRadiusSideProps>,
): Partial<LRadiusStyles> {
  const noRadius = {};
  if (isEmpty(radiuses)) return noRadius;
  if (isString(radiuses) || isNumber(radiuses)) {
    const radiusStrs = radiuses!
      .toString()
      .trim()
      .split(' ')
      .map((e) => px(e));
    if (![1, 2, 4].includes(radiusStrs.length)) return noRadius;
    const result = radiusStrs.join(' ');
    switch (radiusStrs.length) {
      case 1:
      case 2:
        return {
          borderTopLeftRadius: result,
          borderTopRightRadius: result,
          borderBottomLeftRadius: result,
          borderBottomRightRadius: result,
        };
      case 4:
        return {
          borderTopLeftRadius: radiusStrs[0],
          borderTopRightRadius: radiusStrs[1],
          borderBottomLeftRadius: radiusStrs[3],
          borderBottomRightRadius: radiusStrs[2],
        };
      default:
        return noRadius;
    }
  }
  let result: Partial<LRadiusStyles> = {};
  let key: keyof Partial<LRadiusSideProps>;
  for (key in radiuses as Partial<LRadiusSideProps>) {
    let radius = pickOneRadius(key, radiuses![key]);
    result = { ...result, ...radius };
  }
  return result;
}

export interface LBoxShadowStyles {
  boxShadow?: string;
}

/**
 * 生成box shadow
 */
export function generateBoxShadow(shadow?: string | string[]): Partial<LBoxShadowStyles> {
  const noShadow = {};
  if (isEmpty(shadow)) return noShadow;
  const shadows = isString(shadow) ? [shadow] : shadow!;
  const shadowStr: string[] = [];
  for (const s of shadows) {
    const ss = (s as string).trim().split(' ');
    if ([3, 4, 5, 6].includes(ss.length)) {
      const inset = !isStringNumber(ss[0]) ? ss.splice(0, 1) : null;
      const color = ss.splice(-1);
      const nums = ss.map((e) => px(e));
      let result: string;
      if (inset !== null) {
        result = [inset, ...nums, color].join(' ');
      } else {
        result = [...nums, color].join(' ');
      }
      shadowStr.push(result);
    }
  }
  return { boxShadow: shadowStr.join(',') };
}

export interface LTextShadowStyles {
  textShadow?: string;
}

/**
 * 生成text shadow
 */
export function generateTextShadow(shadow?: string | string[]): string {
  if (isEmpty(shadow)) return 'none';
  const shadows = isString(shadow) ? [shadow] : shadow!;
  const shadowStr: string[] = [];
  for (const s of shadows) {
    const ss = (s as string).trim().split(' ');
    if ([3, 4].includes(ss.length)) {
      const color = ss.splice(-1);
      const nums = ss.map((e) => px(e));
      shadowStr.push([...nums, color].join(' '));
    }
  }
  return shadowStr.join(',');
}

export interface LGradientStyles {
  background?: string;
}

/**
 * 生成背景渐变色（gradient）
 */
export function generateGradient(gradient?: string | string[]): Partial<LGradientStyles> {
  // at 10 20, => at 10px 20px,
  function toPx(str: string): string {
    const m = str.match(/at ([0-9]+) ([0-9]+),/);
    if (isEmpty(m)) return str;
    const replace = `at ${px(m![1])} ${px(m![2])},`;
    return str.replace(m![0], replace);
  }
  const noGradient = {};
  if (isEmpty(gradient)) return noGradient;
  const gradients = (isString(gradient) ? [gradient] : gradient) as string[];
  const gradientStr = gradients.map(toPx);
  return { background: gradientStr.join(',') };
}

interface LStackPositionProps {
  top: number | string;
  left: number | string;
  right: number | string;
  bottom: number | string;
  align: LAlignTypes;
}

interface LStackPositionStyles {
  top: number | string;
  left: number | string;
  right: number | string;
  bottom: number | string;
  transform: string;
}

/**
 * Stack布局中的Position组件位置
 */
export function generateStackPosition(
  p?: Partial<LStackPositionProps>,
): Partial<LStackPositionStyles> {
  if (isEmpty(p)) {
    return {};
  }
  switch (p!.align) {
    case 'topLeft':
      return {
        top: 0,
        left: 0,
      };
    case 'topRight':
      return {
        top: 0,
        right: 0,
      };
    case 'bottomLeft':
      return {
        bottom: 0,
        left: 0,
      };
    case 'bottomRight':
      return {
        bottom: 0,
        right: 0,
      };
    case 'center':
      return {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      };
    case 'topCenter':
      return {
        top: 0,
        left: '50%',
        transform: 'translateX(-50%)',
      };
    case 'bottomCenter':
      return {
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
      };
    case 'centerLeft':
      return {
        left: 0,
        top: '50%',
        transform: 'translateY(-50%)',
      };
    case 'centerRight':
      return {
        right: 0,
        top: '50%',
        transform: 'translateY(-50%)',
      };
    default:
      return {
        top: px(p!.top),
        bottom: px(p!.bottom),
        left: px(p!.left),
        right: px(p!.right),
      };
  }
}
