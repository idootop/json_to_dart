import { env } from '..';

class Log {
  private _canLog = false;

  get canLog(): boolean {
    return this._canLog || env.isDebug;
  }

  /**
   * 设置是否打印日志
   */
  set canLog(v: boolean) {
    this._canLog = v;
  }

  /**
   * console.log
   */
  d(log: any): void {
    if (this.canLog) {
      console.log(log);
    }
  }

  /**
   * console.info
   */
  i(log: any, withTime = false): void {
    if (this.canLog) {
      console.info(this.formatLog(log, withTime));
    }
  }

  /**
   * console.warn
   */
  w(log: any, withTime = false): void {
    if (this.canLog) {
      console.warn(this.formatLog(log, withTime));
    }
  }

  /**
   * console.error
   */
  e(log: any, withTime = false): void {
    // todo 日志上报
    if (this.canLog) {
      console.error(this.formatLog(log, withTime));
    }
  }

  private formatLog(log: any, withTime = false): any {
    const timestamp = Date.now();
    const time = new Date(timestamp);
    const timeStr = time.toLocaleTimeString();
    const data = !withTime ? { time: timeStr, content: log } : log;
    return JSON.stringify(data, null, 2);
  }
}

export const log = new Log();
