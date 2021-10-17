// @ts-nocheck
import parserTypescript from 'https://cdn.jsdelivr.net/npm/prettier@2.4.1/esm/parser-typescript.mjs';
import prettier from 'https://cdn.jsdelivr.net/npm/prettier@2.4.1/esm/standalone.mjs';

export function formatTS(ts: string): string {
  return prettier.format(ts, { parser: 'typescript', plugins: [parserTypescript] });
}
