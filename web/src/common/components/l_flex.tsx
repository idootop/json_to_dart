import { Property } from 'csstype';
import React from 'react';

import { onTap } from '../utils/event';
import { isEmpty, isNotEmpty } from '../utils/is';
import { checkChildren, generateBaseViewStyle, LBaseComponentProps, LBaseViewProps, View } from '.';

interface LFlexProps extends LBaseViewProps, LBaseComponentProps {
  direction: Property.FlexDirection;
  mainAlign: Property.JustifyContent;
  crossAlign: Property.AlignItems;
  mainSize: 'min' | 'max';
}

export const LFlex: React.FC<Partial<LFlexProps>> = (p) => {
  const onClick = onTap(p.onClick);
  const { style, className, children } = p;
  const isRow = p.direction?.includes('row') ?? false;
  const mainSize = p.mainSize ?? 'max';
  const width = isRow && isEmpty(p.width) && mainSize === 'max' ? { width: '100%' } : {};
  const height = !isRow && isEmpty(p.height) && mainSize === 'max' ? { height: '100%' } : {};
  const props = { ...p, ...width, ...height };
  const baseViewStyle = generateBaseViewStyle(props);
  const checkedChildren = checkChildren(
    p.direction!.includes('row') ? 'LRow' : 'LColumn',
    children,
  );
  if (isEmpty(children)) return children;
  if (!isEmpty(checkedChildren)) return checkedChildren;
  return (
    <View
      onClick={onClick}
      className={className}
      style={{
        display: 'flex',
        flexWrap: 'nowrap',
        flexDirection: isNotEmpty(p.direction) ? p.direction : undefined,
        justifyContent: isNotEmpty(p.mainAlign) ? p.mainAlign : undefined,
        alignItems: isNotEmpty(p.crossAlign) ? p.crossAlign : 'center',
        ...baseViewStyle,
        ...style, // 外部内联样式放在最后，优先级最高
      }}
    >
      {children}
    </View>
  );
};
