/**
 * 读取粘贴板文字
 */
export function readClipboard(): Promise<string> {
  return navigator.clipboard.readText();
}

/**
 * 复制文字到粘贴板
 */
export async function writeClipboard(text: string): Promise<void> {
  await navigator.clipboard.writeText(text);
}
