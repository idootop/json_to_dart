import { Property } from 'csstype';
import React from 'react';

import { LBaseComponentProps, LBaseViewProps } from '.';
import { LFlex } from './l_flex';

interface LColumnProps extends LBaseViewProps, LBaseComponentProps {
  mainAlign: Property.JustifyContent;
  crossAlign: Property.AlignItems;
  mainSize: 'min' | 'max';
}

export const LColumn: React.FC<Partial<LColumnProps>> = (p) => {
  return (
    <LFlex direction="column" {...p}>
      {p.children}
    </LFlex>
  );
};
