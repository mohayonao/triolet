# triolet.client
[![NPM Version](http://img.shields.io/npm/v/triolet.client.svg?style=flat-square)](https://www.npmjs.org/package/triolet.client)
[![License](http://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](http://mohayonao.mit-license.org/)

`DRIVER` and `API` in the main thread; `DSP` in the worker thread. This architecture works on the browser.

[![triolet.client](https://raw.githubusercontent.com/wiki/mohayonao/triolet/images/triolet.client.png)](https://github.com/mohayonao/triolet/tree/master/triolet.client)

## Installation

```
$ npm install triolet.client
```

## API
### client/Triolet
- `constructor()`

#### Instance attributes
- `api: TrioletAPI`
- `driver: TrioletDriver`
- `sampleRate: number` _(readonly)_
- `bufferLength: number` _(readonly)_

#### Instance methods
- `compose(spec: object): self`
- `setup(opts: object): self`
- `start(): self`
- `stop(): self`
- `sendToServer(data: any): void`
- `recvToServer(data: any): void`

### worker/Triolet
- `constructor(self: DedicatedWorkerGlobalScope)`

#### Instance attributes
- `dsp: TrioletDSP`
- `sampleRate: number` _(readonly)_
- `bufferLength: number` _(readonly)_

#### Instance methods
- `compose(spec: object): self`
- `setup(opts: object): self`
- `start(): self`
- `stop(): self`
- `sendToClient(data: any): void`
- `recvToClient(data: any): void`

## Interfaces

- [triolet.api](https://github.com/mohayonao/triolet/tree/master/triolet.api)
- [triolet.dsp](https://github.com/mohayonao/triolet/tree/master/triolet.dsp)
- [triolet.driver](https://github.com/mohayonao/triolet/tree/master/triolet.driver)


## Audio Drivers

- [triolet.driver.webaudio](https://github.com/mohayonao/triolet/tree/master/triolet.driver.webaudio)

## License

MIT
