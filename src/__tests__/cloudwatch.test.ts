/* eslint-disable no-return-assign */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import { describe, test, mock, beforeEach, before } from 'node:test';
import assert from 'node:assert';
import { Loggnog } from '..';
import { snapshots } from './lib/snapshots';
import { consoleLogMocker } from './lib/utils';

let logx: Loggnog;

describe('logs in local env', () => {
  before(() => (logx = new Loggnog({ isAws: true, isDebugMode: false })));

  beforeEach(() => {
    mock.reset();

    console.info = mock.fn(consoleLogMocker);
    console.warn = mock.fn(consoleLogMocker);
    console.error = mock.fn(consoleLogMocker);
  });

  test('only message', () => {
    logx.info('ONLY_MESSAGE');

    assert.strictEqual((console.info as any).mock.calls[0].result, snapshots.local.onlyMessage);
  });

  test('object', () => {
    const detail = [
      { foo: 1, bar: 2 },
      { foo: 'three', bar: false },
    ];

    logx.info('SOME_MESSAGE', detail);

    const expected = JSON.stringify({
      lvl: '🔹INFO',
      msg: 'SOME_MESSAGE',
      detail,
    });

    assert.strictEqual((console.info as any).mock.calls[0].result, expected);
  });

  test('error', () => {
    logx.error('SOMETHING_WENT_TERRIBLY_WRONG', new Error('extremely wrong!!!'));

    assert.strictEqual((console.error as any).mock.calls[0].result, snapshots.aws.error);
  });
});
