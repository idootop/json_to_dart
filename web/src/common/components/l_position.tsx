import React from 'react';

import { LAlignTypes, LBaseComponentProps } from '.';

interface LPositionProps extends LBaseComponentProps {
  top: number | string;
  left: number | string;
  right: number | string;
  bottom: number | string;
  align: LAlignTypes;
  size: number | string;
  width: number | string;
  height: number | string;
}

export const LPosition: React.FC<Partial<LPositionProps>> = (p) => p.children as any;
