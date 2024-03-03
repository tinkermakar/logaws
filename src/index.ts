import util from 'node:util';
import { Color, LogDetail, LogMethods } from './types';

export class LogAws {
  #isAws;
  #isDebugMode;
  #inspectOptions;

  constructor({ isAws, isDebugMode }: { isAws: boolean; isDebugMode: boolean }) {
    this.#isAws = isAws;
    this.#isDebugMode = isDebugMode;
    this.#inspectOptions = {
      depth: Infinity,
      ...(isAws
        ? { breakLength: Infinity }
        : {
            colors: true,
            breakLength: 0,
          }),
    };
  }

  #levelParts = new Map([
    [Color.red, { emoji: '🔺' }],
    [Color.orange, { emoji: '🔸' }],
    [Color.blue, { emoji: '🔹' }],
  ]);

  #levelColorMap = new Map([
    ['error', Color.red],
    ['problem', Color.orange],
    ['warn', Color.orange],
    ['info', Color.blue],
    ['debug', Color.blue],
  ]);

  #addLevelEmoji(levelName: string) {
    const color = this.#levelColorMap.get(levelName);
    const levelParts = this.#levelParts.get(color as Color);
    if (levelParts) {
      const { emoji } = levelParts;
      return `${emoji}${levelName}`.toUpperCase();
    }
    return levelName;
  }

  #log(logMethod: LogMethods, lvl: string, msg: string, detail?: LogDetail) {
    // eslint-disable-next-line no-console
    const logFn = console[logMethod];

    if (detail) {
      const withDetail = { lvl, msg, detail };
      try {
        logFn(
          this.#isAws ? JSON.stringify(withDetail) : util.inspect(withDetail, this.#inspectOptions),
        );
      } catch (err) {
        console.error(err);
        console.error(lvl, msg, detail);
      }
    } else logFn(`${lvl}: ${msg}`);
  }

  error(msg: string, detail?: LogDetail) {
    const lvl = this.#addLevelEmoji('error');
    this.#log(LogMethods.error, lvl, msg, detail);
  }

  problem(msg: string, detail?: LogDetail) {
    const lvl = this.#addLevelEmoji('problem');
    this.#log(LogMethods.warn, lvl, msg, detail);
  }

  warn(msg: string, detail?: LogDetail) {
    const lvl = this.#addLevelEmoji('warn');
    this.#log(LogMethods.warn, lvl, msg, detail);
  }

  info(msg: string, detail?: LogDetail) {
    const lvl = this.#addLevelEmoji('info');
    this.#log(LogMethods.info, lvl, msg, detail);
  }

  debug(msg: string, detail?: LogDetail) {
    const lvl = this.#addLevelEmoji('debug');
    if (this.#isDebugMode) this.#log(LogMethods.info, lvl, msg, detail);
  }
}
