import React from 'react';

import { onTap } from '../utils/event';
import { generateBaseViewStyle, LBaseComponentProps, LBaseViewProps } from '.';

interface LImageProps extends LBaseViewProps, LBaseComponentProps {
  src: string;
  /**
   * 图片平铺方式
   */
  fit: 'fill' | 'contain' | 'cover' | 'none' | 'scale-down';
}

export const LImage: React.FC<Partial<LImageProps>> = (p) => {
  const onClick = onTap(p.onClick);
  const { style, className } = p;
  const baseViewStyle = generateBaseViewStyle(p);
  const src = p.src;
  const fit = p.fit ?? 'cover';
  return (
    <img
      onClick={onClick}
      src={src}
      className={className}
      style={{
        ...baseViewStyle,
        objectFit: fit,
        ...style, // 外部内联样式放在最后，优先级最高
      }}
    />
  );
};
