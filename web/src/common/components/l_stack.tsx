import { Property } from 'csstype';
import React, { ReactNode } from 'react';

import { onTap } from '../utils/event';
import { isArray, isEmpty } from '../utils/is';
import {
  checkChildren,
  generateBaseViewStyle,
  generateStackPosition,
  LBaseComponentProps,
  LBaseViewProps,
  View,
} from '.';

interface LStackProps extends LBaseViewProps, LBaseComponentProps {
  size: number | string;
  width: number | string;
  height: number | string;
  color: Property.Color;
  overflow: Property.Overflow;
}

export const LStack: React.FC<Partial<LStackProps>> = (p) => {
  const onClick = onTap(p.onClick);
  const { style, className, children } = p;
  const baseViewStyle = generateBaseViewStyle(p);
  const checkedChildren = checkChildren('LStack', children);
  if (isEmpty(children)) return children;
  if (!isEmpty(checkedChildren)) return checkedChildren;
  const target = children![0];
  let items = (children as ReactNode[]).slice(1);
  const content = items.find((e) => isArray(e)) as any;
  if (content !== undefined) {
    const index = items.indexOf(content);
    items.splice(index, 1);
    items = [...items, ...content];
  }
  const contents: ReactNode[] = items.map((item, index) => {
    const position = generateStackPosition((item as any).props);
    return (
      <View key={index} style={{ ...position, position: 'absolute' }}>
        {item}
      </View>
    );
  });
  return (
    <View
      onClick={onClick}
      className={className}
      style={{
        position: 'relative',
        ...baseViewStyle,
        ...style, // 外部内联样式放在最后，优先级最高
      }}
    >
      {contents}
      {target}
    </View>
  );
};
