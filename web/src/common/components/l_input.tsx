import React from 'react';
import styled from 'styled-components';

import {
  generateBaseViewStyle,
  generateHintTextStyleStr,
  generateTextStyle,
  LTextareaProps,
} from '.';

interface LInputProps extends LTextareaProps {
  /**
   * 是否为密码类型
   */
  password: boolean;
  /**
   * 设置键盘右下角的文字
   */
  confirmType: 'done' | 'search' | 'enter' | 'go' | 'next' | 'previous' | 'send';
}

const StyledInput = styled.input.attrs((props: { hintStyle: string }) => ({
  hintStyle: props.hintStyle || '',
}))`
  all: unset;
  ::placeholder${(props) => `{${props.hintStyle}}`}
  ::-webkit-input-placeholder${(props) => `{${props.hintStyle}}`}
  :-ms-input-placeholder${(props) => `{${props.hintStyle}}`}
`;

/**
 * 单行文本输入框
 */
export const LInput: React.FC<Partial<LInputProps>> = (p) => {
  const { className, style } = p;
  const baseViewStyle = generateBaseViewStyle(p);
  const {
    value,
    hint = '请输入...',
    textStyle = {},
    hintStyle = {},
    minLength = -1,
    maxLength = -1,
    autoFocus = false,
    password = false,
    type = 'text',
    confirmType = 'done',
    onChange,
    onSubmit,
    onFocus,
    onBlur,
    disabled,
  } = p;
  const realTextStyle = generateTextStyle(textStyle);
  const hintStyleStr = generateHintTextStyleStr(hintStyle, textStyle);
  return (
    <StyledInput
      className={className}
      type={password ? 'password' : 'text'}
      value={value}
      placeholder={hint}
      minLength={minLength}
      maxLength={maxLength}
      disabled={disabled}
      autoFocus={autoFocus}
      inputMode={type}
      enterKeyHint={confirmType}
      onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
        if (onChange) onChange(e.target.value);
        return e;
      }}
      onSubmit={(e: React.ChangeEvent<HTMLInputElement>) => {
        if (onSubmit) onSubmit(e.target.value);
      }}
      onFocus={(e: React.FocusEvent<HTMLInputElement>) => {
        if (onFocus) onFocus(e.target.value);
      }}
      onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
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
