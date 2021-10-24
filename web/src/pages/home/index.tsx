import { useState } from 'react';
import styled from 'styled-components';

import {
  LColumn,
  LExpaned,
  LInput,
  LPage,
  LPosition,
  LRow,
  LSpace,
  LStack,
  LText,
  LTextarea,
  LView,
} from '@/common/components';
import { LCode } from '@/common/components/l_code';
import { px, showToast, writeClipboard } from '@/common/services';
import { isLightColor, VoidCallback } from '@/common/utils';
import { colors } from '@/styles/colors';
import { json2dart, json2ts } from '@/utils/format';

function canStart(): boolean {
  return state.json.trim() !== '' && state.className.trim() !== '';
}

let refresh = () => {};
const state = {
  json: '',
  lastJson: '',
  result: '',
  className: 'ClassName',
  format: 'dart',
  completed: false,
};

export const Home = () => {
  const [flag, setFlag] = useState(false);
  refresh = () => {
    setFlag(!flag);
  };
  return (
    <LPage color={colors.whiteClean}>
      <LStack size="100%">
        <LColumn size="100%">
          <LSpace height="10vh" />
          <LText size={64} weight="bold" color={colors.blackText}>
            JSON to Class
          </LText>
          <LSpace height={32} />
          <LTitle />
          <LSpace height="5vh" />
          <LExpaned align="center">
            <LRow mainAlign="center" height="100%">
              <LSpace width={260} />
              <InputArea />
              <LSpace width={100} />
              <RightActions width={260} height={96} radius={24} />
            </LRow>
          </LExpaned>
          <LSpace height="10vh" />
          <LFooter />
          <LSpace height="5vh" />
        </LColumn>
        <BlueCicle size={440} />
      </LStack>
    </LPage>
  );
};

const InputArea = () => {
  const { completed, format, result } = state;
  let json = state.json.trim();
  try {
    json = json === '' ? '' : JSON.stringify(JSON.parse(json), undefined, 4);
  } catch (_) {}
  const code = completed ? result : json;
  const language = completed ? (format === 'dart' ? 'dart' : 'typescript') : 'json';
  const onChange = (s?: string) => {
    state.json = s ?? '';
    if (state.completed && state.lastJson !== state.json) {
      state.completed = false;
    }
    refresh();
  };
  return (
    <LStack radius={50} height="100%" width="60vw" padding="50" color={colors.white}>
      <LView
        radius={50}
        height="100%"
        width="60vw"
        padding="50"
        color={colors.white}
        overflow="scroll"
      >
        <LCode
          selectable
          size="100%"
          language={language}
          textStyle={{
            size: 24,
          }}
        >
          {code}
        </LCode>
      </LView>
      <LPosition align="center">
        <LTextarea
          hint="复制/粘贴JSON到此处"
          hintStyle={{
            color: colors.greyTextClean,
          }}
          onChange={onChange}
          textStyle={{ size: 36, color: 'transparent', whiteSpace: 'pre' }}
        />
      </LPosition>
    </LStack>
  );
};

const RightActions = (p: { width?: number; height?: number; radius?: number }) => {
  const { width = 260, height = 96, radius = 24 } = p;
  const { completed, format, className } = state;
  const json = state.json.trim();
  const selectTS = format === 'typescript';
  const select = (mode: string): void => {
    state.format = mode;
    refresh();
    if (completed) {
      try {
        const result =
          state.format === 'typescript' ? json2ts(className, json) : json2dart(className, json);
        if (result !== undefined) {
          showToast('转换成功', { type: 'success' });
          state.result = result;
          refresh();
          return;
        }
      } catch (e) {
        console.log(e);
      }
      showToast('无效的JSON，请修改后重试！', { type: 'error' });
    }
  };
  const onChangeClassName = (s?: string): void => {
    state.className = s?.trim() ?? '';
    refresh();
  };
  const onTapFinish = async () => {
    if (!canStart()) {
      if (json === '') {
        showToast('JSON不能为空!', { type: 'error' });
      }
      if (state.className.trim() === '') {
        showToast('ClassName不能为空!', { type: 'error' });
      }
      return;
    }
    if (!completed) {
      try {
        const result = selectTS ? json2ts(className, json) : json2dart(className, json);
        if (result !== undefined) {
          showToast('转换成功', { type: 'success' });
          state.result = result;
          state.completed = true;
          refresh();
          return;
        }
      } catch (e) {
        console.log(e);
      }
      showToast('无效的JSON，请修改后重试！', { type: 'error' });
    } else {
      await writeClipboard(state.result);
      showToast('已复制到粘贴板', { type: 'success' });
    }
  };

  return (
    <LColumn mainSize="max" mainAlign="space-between">
      <LView color={colors.white} width={width} height={height} radius={radius} align="center">
        <LInput
          value={className}
          hint="请输入..."
          hintStyle={{
            color: colors.greyTextClean,
          }}
          onChange={onChangeClassName}
          textStyle={{
            size: 36,
            color: colors.blackText,
            whiteSpace: 'pre',
            textAlign: 'center',
            weight: 'bold',
          }}
        />
      </LView>
      <LView color={colors.white} width={width} height={height} radius={radius}>
        <LRow>
          <Button
            text="Dart"
            width={width / 2}
            color={selectTS ? colors.white : colors.blueClean}
            onClick={() => {
              select('dart');
            }}
          />
          <Button
            text="TS"
            width={width / 2}
            color={selectTS ? colors.redClean : colors.white}
            onClick={() => {
              select('typescript');
            }}
          />
        </LRow>
      </LView>
      <Button
        width={width}
        onClick={onTapFinish}
        text={completed ? '一键复制' : '开始转换'}
        color={canStart() ? colors.white : colors.greyText}
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
    width = 260,
    height = 96,
    radius = 24,
    fontSize = 36,
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

const LFooter = () => {
  return (
    <LRow mainAlign="center">
      <LText color={colors.blackText} size={32} weight="bold">
        Made with&nbsp;
      </LText>
      <Heart>❤️</Heart>
      <LText color={colors.blackText} size={32} weight="bold">
        &nbsp;by WJG.
      </LText>
    </LRow>
  );
};

const Heart = styled.div`
  text-align: center;
  font-size: ${px(32)};
  animation: heartbeat 1s infinite;
  @keyframes heartbeat {
    0% {
      transform: scale(0.75);
    }
    20% {
      transform: scale(1);
    }
    40% {
      transform: scale(0.75);
    }
    60% {
      transform: scale(1);
    }
    80% {
      transform: scale(0.75);
    }
    100% {
      transform: scale(0.75);
    }
  }
`;

const LTitle = () => {
  return (
    <LRow mainAlign="center">
      <LText size={32} color={colors.greyText}>
        将JSON自动解析为Class，给你超
      </LText>
      <FlipText>
        <div>
          <div>优雅</div>
        </div>
        <div>
          <div>强大</div>
        </div>
        <div>
          <div>完美</div>
        </div>
      </FlipText>
      <LText size={32} color={colors.greyText}>
        的空安全体验。
      </LText>
    </LRow>
  );
};

const boxHeight = 32 * 1.5;

const FlipText = styled.div`
  font-size: ${px(32)};
  color: ${colors.greyText};
  height: ${px(boxHeight)};
  overflow: hidden;
  margin: 0 ${px(32 / 4)};

  > div > div {
    color: #fff;
    padding: 0 ${px(32 / 4)};
    height: ${px(boxHeight)};
    margin-bottom: ${px(boxHeight)};
    display: inline-block;
  }

  > div:first-child {
    animation: show 5s linear infinite;
  }

  > div div {
    background: #dc143c;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  > div:first-child div {
    background: #42c58a;
  }
  > div:last-child div {
    background: #4ec7f3;
  }

  @keyframes show {
    0% {
      margin-top: -${px(3 * 2 * boxHeight)};
    }
    5% {
      margin-top: -${px(2 * 2 * boxHeight)};
    }
    33% {
      margin-top: -${px(2 * 2 * boxHeight)};
    }
    38% {
      margin-top: -${px(2 * boxHeight)};
    }
    66% {
      margin-top: -${px(2 * boxHeight)};
    }
    71% {
      margin-top: 0px;
    }
    99.99% {
      margin-top: 0px;
    }
    100% {
      margin-top: -${px(3 * 2 * boxHeight)};
    }
  }
`;
