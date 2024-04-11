# loggnog

[loggnog](https://www.npmjs.com/package/loggnog) is a lightweight logging library for Node.js, designed to print your logs as clear and color-coded as possible both in AWS CloudWatch and in your local terminal.

## Why

I have been using [winston](https://www.npmjs.com/package/winston), a great and versatile module and pretty customizable. But from some point it made more sense to me to create a lightweight alternative customized just for my local + AWS logging needs rather than to keep tweaking winston.

## Key features

- The module will print nicely formatted logs both in local and AWS environments (given `isAws` is configured dynamically to be truthy in an AWS environment only). That includes environment-appropriate color coding of object keys and values, as well as the capability to view JSON objects in with human-readable indentation.

- Since AWS logs are JSON objects, it is impossible to color strings there, so I am using little emoji squares and triangles to add a little color-coding.

- Following log methods are available:

  1. error
  1. problem
  1. warn
  1. info
  1. debug

- `debug` level logs may be prevented from getting logged if `isDebugMode` is falsy

- The introduction of `problem` level logs aims to capture error responses resulting from certain API requests. These errors signify expected behavior on the server but may present as issues for the client. Typically, `problem` level logs correspond to HTTP status code 400, while `error` level logs are reserved for HTTP status code 500 responses.

## Quick start

```js
const { Loggnog } = require('loggnog');

// configure
const logx = new Loggnog({ isAws: true, isDebugMode: false });

// Log a message
logx.info('This is a log message');

// Debug message
// This message will be logged inly if isDebugMode is truthy above
logger.debug('FOO_PAYLOAD', { foo: 'bar' });

// Log an error
logx.error('OTHER_ERROR', new Error('Something went wrong'));
```

## Configuration

| Key         | Default | Description                                                                                                                                   |
| ----------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| isAws       | false   | Tell the module (programmatically) if it runs in the AWS environment to optimize for that environment. Optimized for local console by default |
| isDebugMode | false   | if true `logx.debug` messages will be logged to the terminal                                                                                  |

## Limitations

- Log methods can accept 1 or 2 arguments, and the first one must always be a regular string
- Extremely opinionated, no room for customization
- No equivalent for console.log, use logx.info instead
