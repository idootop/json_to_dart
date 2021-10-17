import React from 'react';

import { onTap } from '../utils/event';
import { generateBaseViewStyle, LBaseComponentProps, LBaseViewProps, View } from '.';

interface LSpaceProps extends LBaseViewProps, LBaseComponentProps {}

/**
 * 没有子元素的View
 *
 * 一般用来充当占位符
 */
export const LSpace: React.FC<Partial<LSpaceProps>> = (p) => {
  const onClick = onTap(p.onClick);
  const { style, className } = p;
  const baseViewStyle = generateBaseViewStyle(p);
  return (
    <View
      onClick={onClick}
      className={className}
      style={{
        ...baseViewStyle,
        ...style, // 外部内联样式放在最后，优先级最高
      }}
    />
  );
};
