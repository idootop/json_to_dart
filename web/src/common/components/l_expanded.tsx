import React from 'react';

import { onTap } from '../utils/event';
import { isNotEmpty } from '../utils/is';
import { toNumber } from '../utils/transform';
import {
  checkChild,
  generateAlign,
  generateBaseViewStyle,
  LAlignTypes,
  LBaseComponentProps,
  LBaseViewProps,
  View,
} from '.';

interface LExpanedProps extends LBaseViewProps, LBaseComponentProps {
  flex: number | string;
  align: LAlignTypes;
}

export const LExpaned: React.FC<Partial<LExpanedProps>> = (p) => {
  const onClick = onTap(p.onClick);
  const { style, className, children } = p;
  const baseViewStyle = generateBaseViewStyle(p);
  const align = isNotEmpty(p.align) ? generateAlign(p.align) : undefined;
  return (
    (children === undefined ? undefined : checkChild('LExpaned', children)) ?? (
      <View
        onClick={onClick}
        className={className}
        style={{
          flexGrow: isNotEmpty(p.flex) ? Math.floor(toNumber(p.flex!.toString())!) : 1,
          ...baseViewStyle,
          ...align,
          ...style, // 外部内联样式放在最后，优先级最高
        }}
      >
        {children}
      </View>
    )
  );
};
