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

  #log(logMethod: LogMethods, level: string, message: string, detail?: LogDetail) {
    // eslint-disable-next-line no-console
    const logFn = console[logMethod];

    if (detail) {
      const withDetail = { level, message, detail };
      try {
        logFn(
          this.#isAws ? JSON.stringify(withDetail) : util.inspect(withDetail, this.#inspectOptions),
        );
      } catch (err) {
        console.error(err);
        console.error(level, message, detail);
      }
    } else logFn(`${level}: ${message}`);
  }

  error(message: string, detail?: LogDetail) {
    const level = this.#addLevelEmoji('error');
    this.#log(LogMethods.error, level, message, detail);
  }

  problem(message: string, detail?: LogDetail) {
    const level = this.#addLevelEmoji('problem');
    this.#log(LogMethods.warn, level, message, detail);
  }

  warn(message: string, detail?: LogDetail) {
    const level = this.#addLevelEmoji('warn');
    this.#log(LogMethods.warn, level, message, detail);
  }

  info(message: string, detail?: LogDetail) {
    const level = this.#addLevelEmoji('info');
    this.#log(LogMethods.info, level, message, detail);
  }

  debug(message: string, detail?: LogDetail) {
    const level = this.#addLevelEmoji('debug');
    if (this.#isDebugMode) this.#log(LogMethods.info, level, message, detail);
  }
}
