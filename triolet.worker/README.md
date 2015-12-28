# triolet.worker
[![NPM Version](http://img.shields.io/npm/v/triolet.worker.svg?style=flat-square)](https://www.npmjs.org/package/triolet.worker)
[![License](http://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](http://mohayonao.mit-license.org/)

`DRIVER` in the main thread; `API` and `DSP` in the worker thread. This architecture works on the browser.

[![triolet.worker](https://raw.githubusercontent.com/wiki/mohayonao/triolet/images/triolet.worker.png)](https://github.com/mohayonao/triolet/tree/master/triolet.worker)

## Installation

```
$ npm install triolet.worker
```

## API
### client/Triolet
- `constructor()`

#### Instance attributes
- `driver: TrioletDriver`
- `sampleRate: number` _(readonly)_
- `bufferLength: number` _(readonly)_

#### Instance methods
- `compose(spec: object): self`
- `setup(opts: object): self`
- `start(): self`
- `stop(): self`

### worker/Triolet
- `constructor(self: DedicatedWorkerGlobalScope)`

#### Instance attributes
- `api: TrioletAPI`
- `dsp: TrioletDSP`
- `sampleRate: number` _(readonly)_
- `bufferLength: number` _(readonly)_

#### Instance methods
- `compose(spec: object): self`
- `setup(opts: object): self`
- `start(): self`
- `stop(): self`
- `sendToClient(data: any): void`
- `sendToServer(data: any): void`

## Interfaces

- [triolet.api](https://github.com/mohayonao/triolet/tree/master/triolet.api)
- [triolet.dsp](https://github.com/mohayonao/triolet/tree/master/triolet.dsp)
- [triolet.driver](https://github.com/mohayonao/triolet/tree/master/triolet.driver)


## Audio Drivers

- [triolet.driver.webaudio](https://github.com/mohayonao/triolet/tree/master/triolet.driver.webaudio)

## License

MIT
