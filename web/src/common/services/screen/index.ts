import { isEmpty, isFloatString, isIntString, toNumber } from '../../utils';

/**
 * 设计稿px转rpx
 *
 * 自动转换：1、1.5、1px
 *
 * 不转换：1%、1vw、1rem
 */
export function px(v?: number | string): string | undefined {
  if (isEmpty(v)) return undefined;
  const str = v!.toString().replace('px', '');
  const needTransform = isIntString(str) || isFloatString(str);
  return needTransform ? (toNumber(str)! * onePx()).toString() + 'vw' : v!.toString();
}

/**
 * 真实px转设计稿px
 */
export function realPx(v?: number): number {
  if (isEmpty(v)) return 0;
  return (v! * screen.pixelRatio) / onePx();
}

/**
 * 1px（设计稿）等于多少vw
 */
export const onePx: () => number = () => 100 / screen.designSize.width;

interface Size {
  width: number;
  height: number;
}

interface ScreenInfo {
  width: number;
  height: number;
  window: Size;
}

class Screen {
  designSize = {
    width: 1920,
    height: 1080,
  };
  get info(): ScreenInfo {
    const screenHeight = window.screen.height;
    const screenWidth = window.screen.width;
    const windowWidth =
      window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    const windowHeight =
      window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    return {
      width: realPx(screenWidth),
      height: realPx(screenHeight),
      window: {
        width: realPx(windowWidth),
        height: realPx(windowHeight),
      },
    };
  }
  get width(): number {
    return this.info.width;
  }
  get height(): number {
    return this.info.height;
  }
  get window(): Size {
    return this.info.window;
  }
  get pixelRatio(): number {
    const width =
      window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    return screen.designSize.width / width;
  }
}

export const screen = new Screen();
