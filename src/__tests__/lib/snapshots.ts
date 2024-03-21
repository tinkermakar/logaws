export const snapshots = {
  local: {
    onlyMessage: '🔹INFO: ONLY_MESSAGE',
    object:
      "{\n  lvl: \x1B[32m'🔹INFO'\x1B[39m,\n  msg: \x1B[32m'SOME_MESSAGE'\x1B[39m,\n  detail: [\n    {\n      foo: \x1B[33m1\x1B[39m,\n      bar: \x1B[33m2\x1B[39m\n    },\n    {\n      foo: \x1B[32m'three'\x1B[39m,\n      bar: \x1B[33mfalse\x1B[39m\n    }\n  ]\n}",
    error:
      "{\n  lvl: \x1B[32m'🔺ERROR'\x1B[39m,\n  msg: \x1B[32m'SOMETHING_WENT_TERRIBLY_WRONG'\x1B[39m,\n  detail: Error: extremely wrong!!!\n      at TestContext.<anonymous> \x1B[90m(/home/makar/_apps/loggnog/\x1B[39msrc/__tests__/local.test.ts:41:49\x1B[90m)\x1B[39m\n  \x1B[90m    at Test.runInAsyncScope (node:async_hooks:206:9)\x1B[39m\n  \x1B[90m    at Test.run (node:internal/test_runner/test:631:25)\x1B[39m\n  \x1B[90m    at async Suite.processPendingSubtests (node:internal/test_runner/test:374:7)\x1B[39m\n}",
  },

  aws: {
    error:
      '{"lvl":"🔺ERROR","msg":"SOMETHING_WENT_TERRIBLY_WRONG","detail":{"stack":"Error: extremely wrong!!!\\n    at TestContext.<anonymous> (/home/makar/_apps/loggnog/src/__tests__/cloudwatch.test.ts:47:49)\\n    at Test.runInAsyncScope (node:async_hooks:206:9)\\n    at Test.run (node:internal/test_runner/test:631:25)\\n    at async Suite.processPendingSubtests (node:internal/test_runner/test:374:7)","message":"extremely wrong!!!"}}',
  },
};
