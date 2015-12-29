# triolet.bundle
[![NPM Version](http://img.shields.io/npm/v/triolet.bundle.svg?style=flat-square)](https://www.npmjs.org/package/triolet.bundle)
[![License](http://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](http://mohayonao.mit-license.org/)

All components in the main thread. This architecture works on the browser and the Node.js

[![triolet.bundle](https://raw.githubusercontent.com/wiki/mohayonao/triolet/images/triolet.bundle.png)](https://github.com/mohayonao/triolet/tree/master/triolet.bundle)

## Installation

```
$ npm install triolet.bundle
```

## API
### Triolet
- `constructor()`

#### Instance attributes
- `api: TrioletAPI`
- `dsp: TrioletDSP`
- `driver: pico.driver`
- `sampleRate: number` _(implicit readonly)_
- `bufferLength: number` _(implicit readonly)_
- `state: string` _(implicit readonly)_

#### Instance methods
- `compose(spec: object): self`
- `setup(opts: object): self`
- `start(): self`
- `stop(): self`
- `sendToAPI(data: any): void`
- `sendToDSP(data: any): void`

## Interfaces

- [triolet.api](https://github.com/mohayonao/triolet/tree/master/triolet.api)
- [triolet.dsp](https://github.com/mohayonao/triolet/tree/master/triolet.dsp)

## Audio Driver

- https://github.com/mohayonao/pico.driver

## License

MIT
