import stringify from 'json-stringify-safe';
import util from 'node:util';
import { Color, LogContent, LogDetail, LogMethods } from './types';

export class Loggnog {
  #isAws = false;
  #isDebugMode = false;
  #inspectOptions;

  constructor({ isAws, isDebugMode }: { isAws?: boolean; isDebugMode?: boolean }) {
    if (isAws) this.#isAws = true;
    if (isDebugMode) this.#isDebugMode = true;
    this.#inspectOptions = {
      depth: Infinity,
      ...(this.#isAws
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

  #finalizeLogContent(logDetailRaw: LogContent) {
    if (this.#isAws) {
      if (logDetailRaw.detail instanceof Error) {
        const extraFields = [
          ...new Set([
            ...Object.getOwnPropertyNames(logDetailRaw),
            ...Object.getOwnPropertyNames(logDetailRaw.detail),
          ]),
        ];
        return JSON.stringify(logDetailRaw, extraFields);
      }

      return stringify(logDetailRaw);
    }
    return util.inspect(logDetailRaw, this.#inspectOptions);
  }

  #log(logMethod: LogMethods, lvl: string, msg: string, detail?: LogDetail) {
    // eslint-disable-next-line no-console
    const logFn = console[logMethod];

    if (detail) {
      const logDetailRaw = { lvl, msg, detail };
      try {
        logFn(this.#finalizeLogContent(logDetailRaw));
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
