export type LogDetail = string | object | Array<unknown> | null;

export interface LogContent {
  lvl: string;
  msg: string;
  detail?: LogDetail;
}

export enum LogMethods {
  error = 'error',
  warn = 'warn',
  info = 'info',
}

export enum Color {
  red = 'red',
  orange = 'orange',
  blue = 'blue',
}
