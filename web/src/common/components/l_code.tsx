import 'highlight.js/styles/atom-one-light.css';

import hljs from 'highlight.js/lib/core';
import dart from 'highlight.js/lib/languages/dart';
import json from 'highlight.js/lib/languages/json';
import typescript from 'highlight.js/lib/languages/typescript';
import React, { useEffect } from 'react';

import { useID, useInit } from '../hooks';
import {
  generateBaseViewStyle,
  generateTextStyle,
  LBaseComponentProps,
  LBaseViewProps,
  LTextStyle,
} from '.';

let inited = false;

export function initHighlightjs(): void {
  if (inited) return;
  hljs.registerLanguage('typescript', typescript);
  hljs.registerLanguage('dart', dart);
  hljs.registerLanguage('json', json);
  inited = true;
}

interface LCodeProps extends LBaseViewProps, LBaseComponentProps {
  textStyle: Partial<LTextStyle>;
}

export const LCode: React.FC<{ language: 'dart' | 'typescript' | 'json' } & Partial<LCodeProps>> = (
  p,
) => {
  const id = 'code_' + useID().toString();
  useInit(() => {
    initHighlightjs();
  });
  const { style, children, textStyle = {} } = p;
  const finalTextStyle = generateTextStyle(textStyle);
  const baseViewStyle = generateBaseViewStyle(p);
  useEffect(() => {
    const block = document.querySelector<HTMLElement>(`#${id}`)!;
    block.innerHTML = children as string;
    hljs.highlightBlock(block);
  });

  return (
    <pre
      id={id}
      className={`language-${p.language}`}
      style={{
        ...baseViewStyle,
        ...finalTextStyle,
        whiteSpace: 'pre',
        ...style, // 外部内联样式放在最后，优先级最高
      }}
    >
      <code>{children}</code>
    </pre>
  );
};
