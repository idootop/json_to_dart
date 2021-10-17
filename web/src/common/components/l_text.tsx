import React from 'react';

import { onTap } from '../utils/event';
import { generateTextStyle, LBaseComponentProps, LTextStyle, View } from '.';

interface LTextProps extends LBaseComponentProps, LTextStyle {}

export const LText: React.FC<Partial<LTextProps>> = (p) => {
  const onClick = onTap(p.onClick);
  const { style, className, children } = p;
  const textStyle = generateTextStyle(p);
  return (
    <View
      onClick={onClick}
      className={className}
      style={{
        ...textStyle,
        ...style,
      }}
    >
      {children}
    </View>
  );
};
