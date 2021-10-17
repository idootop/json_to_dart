import React from 'react';

import { OnClickEvent } from '../../utils';
import { LBaseComponentReturnProps } from '.';

type ViewProps = LBaseComponentReturnProps;

export const View: React.FC<Partial<ViewProps>> = (p) => {
  const onClick = (e: OnClickEvent) => p.onClick?.(e);
  const { style, className, children } = p;
  return (
    <div onClick={onClick} className={className} style={style}>
      {children}
    </div>
  );
};
