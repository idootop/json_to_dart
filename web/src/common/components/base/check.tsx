import { ReactNode } from 'react';

import { isEmpty, isString } from '../../utils/is';
import { LText } from '..';

/**
 * 校验含有多个元素
 */
export function checkChildren(label: string, e: ReactNode): any {
  if (isEmpty(e)) return undefined;
  if (isString(e)) {
    return <LText color="red" weight="bold">{`⚠️请使用<LText>${e}</LText>引用文字！`}</LText>;
  }
  const length = (e as any).length ?? 0;
  if (length < 2) {
    return (
      <LText color="red" weight="bold">
        {`⚠️${label}内部至少应放2个元素！`}
      </LText>
    );
  }
  for (let s of e as any) {
    if (isString(s)) {
      return <LText color="red" weight="bold">{`⚠️请使用<LText>${s}</LText>引用文字！`}</LText>;
    }
  }
  // 检测正常
  return undefined;
}

/**
 * 校验只含有一个元素
 */
export function checkChild(label: string, e: ReactNode): any {
  if (isEmpty(e)) return undefined;
  if (isString(e)) {
    return <LText color="red" weight="bold">{`⚠️请使用<LText>${e}</LText>引用文字！`}</LText>;
  }
  const length = (e as any).length ?? 1;
  if (length !== 1) {
    return (
      <LText color="red" weight="bold">
        {`⚠️${label}内部只能放一个元素！`}
      </LText>
    );
  }
  // 检测正常
  return undefined;
}
