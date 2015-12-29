# triolet.api
[![NPM Version](http://img.shields.io/npm/v/triolet.api.svg?style=flat-square)](https://www.npmjs.org/package/triolet.api)
[![License](http://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](http://mohayonao.mit-license.org/)

> base class for triolet API

## Installation

```
$ npm install triolet.api
```

## API
### TrioletAPI
- `constructor()`

#### Instance attributes
- `triolet: Triolet` _(required)_

#### Instance methods
- `setup(opts: object): void`
- `start(): void`
- `stop(): void`
- `sendToDSP(...args: any): void`
- `recvFromDSP(data: object): void`
- `process(inNumSamples: number): void`

#### Triolet Interface
```
interface Triolet {
  api: TrioletAPI;
  sendToDSP(...args: any) => void;
}
```

## License

MIT
