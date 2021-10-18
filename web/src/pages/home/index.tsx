/* tslint:disable */
/* eslint-disable */
import { useState } from 'react';

import {
  LColumn,
  LExpaned,
  LInput,
  LPage,
  LRow,
  LSpace,
  LStack,
  LText,
  LView,
} from '@/common/components';
import { log, readClipboard, writeClipboard } from '@/common/services';
import { isLightColor, VoidCallback } from '@/common/utils';
import { colors } from '@/styles/colors';
import { formatTS } from '@/utils/format';

export const Home = () => {
  return (
    <LStack>
      <LPage color={colors.whiteClean}>
        <LColumn>
          <LSpace height="10vh" />
          <LText size={64} weight="bold" color={colors.blackText}>
            Json to Class
          </LText>
          <LSpace height={50} />
          <LText color={colors.greyText}>将JSON自动解析为Class，给你超完美的空安全体验。</LText>
          <LSpace height="10vh" />
          <LExpaned align="center">
            <LRow mainAlign="center" height="100%">
              <LSpace width={200} />
              <LView radius={50} height="100%" width="60vw" color={colors.white}>
                <LText color={colors.greyText}>
                  将JSON自动解析为Class，给你超完美的空安全体验。
                </LText>
              </LView>
              <LSpace width={100} />
              <RightActions width={200} />
            </LRow>
          </LExpaned>
          <LSpace height="10vh" />
          <LText color={colors.blackText} weight="bold">
            Made with ❤️ by WJG.
          </LText>
          <LSpace height="10vh" />
        </LColumn>
      </LPage>
      <BlueCicle size={460} />
    </LStack>
  );
};

const RightActions = (p: { width?: number; height?: number; radius?: number }) => {
  const { width = 200, height = 80, radius = 20 } = p;
  const [selectTS, setSelectTS] = useState(false);
  const [canStart, setCanStart] = useState(false);
  const [completed, setCompleted] = useState(false);
  const onTapFinish = async () => {
    if (!canStart) {
      await writeClipboard('test');
      // todo 默认为ClassName
      alert(await readClipboard());
      console.log(
        formatTS(`
      /* eslint-disable @typescript-eslint/explicit-function-return-type */
      /* eslint-disable @typescript-eslint/member-ordering */
      
      class HttpError {
        public code: number;
        public msg: string;
      
        public constructor(p: {
          code?: number;
          msg?: string;
        }) {
          this.code = p.code ?? 0;
          this.msg = p.msg ?? '';
        }
      
        public static fromJson(json = {} as any): HttpError {return new HttpError({
          code : json.code,
          msg : json.msg,
        });}
      
        public toJson() {return {
          code: this.code,
          msg: this.msg,
        };}
      }
      `),
      );
      return;
    }
    if (!completed) {
      // todo
      alert('开始转换');
      // todo
      alert('无效的JSON，请修改后重试！');
      return;
    } else {
      // todo
      alert('已复制到粘贴板');
    }
  };

  return (
    <LColumn mainSize="max" mainAlign="space-between">
      <LView color={colors.white} width={width} height={height} radius={radius}>
        <LText color={colors.blackText} weight="bold">
          一键复制
        </LText>
      </LView>
      <LView color={colors.white} width={width} height={height} radius={radius}>
        <LRow>
          <Button
            text="Dart"
            width={width / 2}
            color={selectTS ? colors.white : colors.blueClean}
            onClick={() => {
              setSelectTS(false);
            }}
          />
          <Button
            text="TS"
            width={width / 2}
            color={selectTS ? colors.redClean : colors.white}
            onClick={() => {
              setSelectTS(true);
            }}
          />
        </LRow>
      </LView>
      <Button
        width={width}
        onClick={onTapFinish}
        text={completed ? '一键复制' : '开始转换'}
        color={canStart ? colors.white : colors.greyText}
      />
    </LColumn>
  );
};

const Button = (p: {
  width?: number;
  text?: string;
  onClick?: VoidCallback;
  color?: string;
  fontSize?: number;
  height?: number;
  radius?: number;
}) => {
  const {
    width = 200,
    height = 80,
    radius = 20,
    fontSize = 32,
    color = colors.white,
    text = 'Button',
    onClick,
  } = p;
  const isLight = isLightColor(color);
  return (
    <LView color={color} width={width} height={height} radius={radius} onClick={onClick}>
      <LText size={fontSize} color={isLight ? colors.blackText : colors.white} weight="bold">
        {text}
      </LText>
    </LView>
  );
};

const BlueCicle = (props: { size?: number }) => {
  const size = props.size ?? 400;
  return (
    <LSpace
      color={colors.blueClean}
      size={size}
      radius={size / 2}
      margin={{ top: -size / 2, left: -size / 2 }}
    />
  );
};
