type EnvMode = 'default' | 'debug' | 'release';

class Env {
  private _mode: EnvMode = 'default';

  /**
   * 当前是否为生产环境
   */
  get isRelease(): boolean {
    return this._mode === 'release';
  }
  /**
   * 当前是否为测试环境
   */
  get isDebug(): boolean {
    return !this.isRelease;
  }

  /**
   * 更改当前环境
   */
  setEnvMode(v: EnvMode): void {
    this._mode = v;
  }
}

export const env = new Env();
