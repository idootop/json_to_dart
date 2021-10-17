import React from 'react';

import { px } from '../services';
import { onTap } from '../utils/event';
import { isNotEmpty } from '../utils/is';
import {
  checkChild,
  generateAlign,
  generateBaseViewStyle,
  LAlignTypes,
  LBaseComponentProps,
  LBaseViewProps,
  View,
} from '.';

interface LViewProps extends LBaseViewProps, LBaseComponentProps {
  /**
   * 居中方式
   *
   * topLeft  ｜  topCenter  ｜ topRight
   *
   * centerLeft  ｜ center  ｜  centerRight
   *
   * bottomLeft ｜  bottomCenter  ｜  bottomRight
   */
  align: LAlignTypes;
  /**
   * 高斯模糊
   */
  blur: number | string;
}

export const LView: React.FC<Partial<LViewProps>> = (p) => {
  const onClick = onTap(p.onClick);
  const { style, className, children } = p;
  const baseViewStyle = generateBaseViewStyle(p);
  const align = generateAlign(p.align);
  return (
    checkChild('LView', children) ?? (
      <View
        onClick={onClick}
        className={className}
        style={{
          ...baseViewStyle,
          ...align,
          filter: isNotEmpty(p.blur) ? `blur(${px(p.blur)})` : undefined,
          ...style, // 外部内联样式放在最后，优先级最高
        }}
      >
        {children}
      </View>
    )
  );
};
