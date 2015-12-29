# triolet.client
[![NPM Version](http://img.shields.io/npm/v/triolet.client.svg?style=flat-square)](https://www.npmjs.org/package/triolet.client)
[![License](http://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](http://mohayonao.mit-license.org/)

`DRIVER` and `API` in the main thread; `DSP` in the worker thread. This architecture works on the browser.

[![triolet.client](https://raw.githubusercontent.com/wiki/mohayonao/triolet/images/triolet.client.png)](https://github.com/mohayonao/triolet/tree/master/triolet.client)

## Installation

```
$ npm install triolet.client
```

## Example

in the main thread

```js
const triolet = require("triolet.client/client")();
const Driver = require("pico.driver.webaudio");
const API = require("./api");

let audioContext = new AudioContext();

triolet.compose({ workerPath: "/path/to/worker", api: new API(), driver: new Driver() });
triolet.setup({ context: audioContext, bufferLength: 1024 });

triolet.start();
```

in the worker thread

```js
const triolet = require("triolet.client/worker")();
const DSP = require("./dsp");

triolet.compose({ dsp: new DSP() });
```

## API
### client/Triolet
- `constructor()`

#### Instance attributes
- `api: TrioletAPI`
- `driver: TrioletDriver`
- `sampleRate: number` _(implicit readonly)_
- `bufferLength: number` _(implicit readonly)_
- `state: string` _(implicit readonly)_

#### Instance methods
- `compose(spec: object): self`
- `setup(opts: object): self`
- `start(): self`
- `stop(): self`
- `sendToDSP(data: any): void`

### worker/Triolet
- `constructor(self: DedicatedWorkerGlobalScope)`

#### Instance attributes
- `dsp: TrioletDSP`
- `sampleRate: number` _(implicit readonly)_
- `bufferLength: number` _(implicit readonly)_
- `state: string` _(implicit readonly)_

#### Instance methods
- `compose(spec: object): self`
- `setup(opts: object): self`
- `start(): self`
- `stop(): self`
- `sendToAPI(data: any): void`

## Interfaces

- [triolet.api](https://github.com/mohayonao/triolet/tree/master/triolet.api)

```
interface trioletAPI {
  optional setup(opts: object) => void;
  optional start() => void;
  optional stop() => void;
  process(inNumSamples: number) => void;
}
```

- [triolet.dsp](https://github.com/mohayonao/triolet/tree/master/triolet.dsp)

```
interface trioletDSP {
  optional setup(opts: object) => void;
  optional start() => void;
  optional stop() => void;
  process(bufL: Float32Array, bufR: Float32Array) => void;
}
```

## Audio Drivers

- https://github.com/mohayonao/pico.driver

## License

MIT
