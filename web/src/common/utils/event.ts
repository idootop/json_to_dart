import React from 'react';

export type OnClickEvent = React.MouseEvent<HTMLDivElement>;

/**
 * 默认点击事件(不冒泡)
 */
export const onTap = (fn?: () => void): ((e: OnClickEvent) => boolean) | undefined => {
  if (fn === undefined) return undefined;
  return (e: OnClickEvent) => {
    e.stopPropagation();
    e.preventDefault();
    fn();
    return false;
  };
};
