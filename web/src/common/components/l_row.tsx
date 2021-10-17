import { Property } from 'csstype';
import React from 'react';

import { LBaseComponentProps, LBaseViewProps } from '.';
import { LFlex } from './l_flex';

interface LRowProps extends LBaseViewProps, LBaseComponentProps {
  mainAlign: Property.JustifyContent;
  crossAlign: Property.AlignItems;
  mainSize: 'min' | 'max';
}

export const LRow: React.FC<Partial<LRowProps>> = (p) => {
  return (
    <LFlex direction="row" {...p}>
      {p.children}
    </LFlex>
  );
};
