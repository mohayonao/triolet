# triolet.audioworker
[![NPM Version](http://img.shields.io/npm/v/triolet.audioworker.svg?style=flat-square)](https://www.npmjs.org/package/triolet.audioworker)
[![License](http://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](http://mohayonao.mit-license.org/)

All components in the worker thread. This architecture works on the browser.

[![triolet.audioworker](https://raw.githubusercontent.com/wiki/mohayonao/triolet/images/triolet.audioworker.png)](https://github.com/mohayonao/triolet/tree/master/triolet.audioworker)

## Installation

```
$ npm install triolet.audioworker
```

## Example

in the main thread

```js
const triolet = require("triolet.audioworker/client")();
const Driver = require("pico.driver.audioworker/client");

let audioContext = new AudioContext();

triolet.compose({ driver: new Driver(), workerPath: "/path/to/worker" });
triolet.setup({ context: audioContext, bufferLength: 1024 });

triolet.sendToWorker({ type: "start" });
```

in the worker thread

```js
const triolet = require("triolet.audioworker/worker")(self);
const Driver = require("pico.driver.audioworker/worker");
const API = require("./api");
const DSP = require("./dsp");

triolet.compose({ api: new API(), dsp: new DSP(), driver: new Driver(self) });

triolet.recvFromClient = (e) => {
  if (e.type === "start") {
    triolet.start();
  }
};
```

## API
### client/Triolet
- `constructor()`

#### Instance attributes
- `driver: TrioletDriver`
- `sampleRate: number` _(implicit readonly)_
- `bufferLength: number` _(implicit readonly)_
- `state: string` _(implicit readonly)_

#### Instance methods
- `compose(spec: object): self`
- `setup(opts: object): self`
- `start(): self`
- `stop(): self`
- `sendToWorker(data: any): void`

### worker/Triolet
- `constructor(self: AudioWorkerGlobalScope)`

#### Instance attributes
- `driver: TrioletDriver`
- `api: TrioletAPI`
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
- `sendToDSP(data: any): void`
- `recvFromClient(data: any): void`

## Interfaces

- [triolet.api](https://github.com/mohayonao/triolet/tree/master/triolet.api)

```
interface TrioletAPI {
  optional setup(opts: object) => void;
  optional start() => void;
  optional stop() => void;
  process(inNumSamples: number) => void;
}
```

- [triolet.dsp](https://github.com/mohayonao/triolet/tree/master/triolet.dsp)

```
interface TrioletDSP {
  optional setup(opts: object) => void;
  optional start() => void;
  optional stop() => void;
  process(bufL: Float32Array, bufR: Float32Array) => void;
}
```

## Audio Drivers

- [pico.driver.audioworker](https://github.com/mohayonao/pico.driver/tree/master/pico.driver.audioworker)

## License

MIT
