// @ts-nocheck
import parserTypescript from 'https://cdn.jsdelivr.net/npm/prettier@2.4.1/esm/parser-typescript.mjs';
import prettier from 'https://cdn.jsdelivr.net/npm/prettier@2.4.1/esm/standalone.mjs';

import * as d from '../assets/js/json2class.js';

export const dart = d;

export function formatTS(ts: string): string {
  return prettier.format(ts, { parser: 'typescript', plugins: [parserTypescript] });
}

export function json2dart(className: string, json: string): string | undefined {
  try {
    return window.json2dart(className, json);
  } catch (e) {
    console.log(e);
    return undefined;
  }
}

export function json2ts(className: string, json: string): string | undefined {
  try {
    const ts = window.json2ts(className, json);
    return formatTS(ts).replaceAll('public ', '');
  } catch (e) {
    console.log(e);
    return undefined;
  }
}
