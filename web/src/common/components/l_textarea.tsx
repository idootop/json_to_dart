import React from 'react';
import styled from 'styled-components';

import {
  generateBaseViewStyle,
  generateHintTextStyleStr,
  generateTextStyle,
  LBaseComponentProps,
  LBaseViewProps,
  LTextStyle,
} from '.';

/**
 * 多行文本输入框
 */
export interface LTextareaProps extends LBaseViewProps, LBaseComponentProps {
  value: string;
  hint: string;
  textStyle: Partial<LTextStyle>;
  hintStyle: Partial<LTextStyle>;
  minLength: number;
  maxLength: number;
  autoFocus: boolean;
  disabled: boolean;
  onChange: (s?: string) => void;
  onSubmit: (s?: string) => void;
  /**
   * 聚焦时
   */
  onFocus: (s?: string) => void;
  /**
   * 失焦时
   */
  onBlur: (s?: string) => void;
  /**
   * 输入框类型
   */
  type: 'search' | 'text' | 'none' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal';
}

const StyledTextarea = styled.textarea.attrs((props: { hintStyle: string }) => ({
  hintStyle: props.hintStyle || '',
}))`
  all: unset;
  ::placeholder${(props) => `{${props.hintStyle}}`} 
  ::-webkit-input-placeholder${(props) => `{${props.hintStyle}}`} 
  :-ms-input-placeholder${(props) => `{${props.hintStyle}}`} 
`;

export const LTextarea: React.FC<Partial<LTextareaProps>> = (p) => {
  const { style, className } = p;
  const baseViewStyle = generateBaseViewStyle(p);
  const {
    value,
    hint = '请输入...',
    textStyle = {},
    hintStyle = {},
    minLength = -1,
    maxLength = -1,
    autoFocus = false,
    type = 'text',
    onChange,
    onSubmit,
    onFocus,
    onBlur,
    disabled,
  } = p;
  const realTextStyle = generateTextStyle(textStyle);
  const hintStyleStr = generateHintTextStyleStr(hintStyle, textStyle);
  return (
    <StyledTextarea
      className={className}
      value={value}
      inputMode={type}
      placeholder={hint}
      minLength={minLength}
      maxLength={maxLength}
      disabled={disabled}
      autoFocus={autoFocus}
      onInput={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (onChange) onChange(e.target.value);
        return e;
      }}
      onSubmit={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (onSubmit) onSubmit(e.target.value);
      }}
      onFocus={(e: React.FocusEvent<HTMLTextAreaElement>) => {
        if (onFocus) onFocus(e.target.value);
      }}
      onBlur={(e: React.FocusEvent<HTMLTextAreaElement>) => {
        if (onBlur) onBlur(e.target.value);
      }}
      hintStyle={hintStyleStr}
      style={{
        ...baseViewStyle,
        ...realTextStyle,
        ...style,
        overflow: 'hidden',
        resize: 'none',
      }}
    />
  );
};
