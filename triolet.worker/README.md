# triolet.worker
[![NPM Version](http://img.shields.io/npm/v/triolet.worker.svg?style=flat-square)](https://www.npmjs.org/package/triolet.worker)
[![License](http://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](http://mohayonao.mit-license.org/)

`DRIVER` in the main thread; `API` and `DSP` in the worker thread. This architecture works on the browser.

[![triolet.worker](https://raw.githubusercontent.com/wiki/mohayonao/triolet/images/triolet.worker.png)](https://github.com/mohayonao/triolet/tree/master/triolet.worker)

## Installation

```
$ npm install triolet.worker
```

## Example

in the main thread

```js
const triolet = require("triolet.worker/client")();
const Driver = require("pico.driver.webaudio");

let audioContext = new AudioContext();

triolet.compose({ workerPath: "/path/to/worker", driver: new Driver() });
triolet.setup({ context: audioContext, bufferLength: 1024 });

triolet.sendToWorker({ type: "start" });
```

in the worker thread

```js
const triolet = require("triolet.worker/worker")(self);
const API = require("./api");
const DSP = require("./dsp");

triolet.compose({ api: new API(), dsp: new DSP() });

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
- `constructor(self: DedicatedWorkerGlobalScope)`

#### Instance attributes
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

- [pico.driver.webaudio](https://github.com/mohayonao/pico.driver/tree/master/pico.driver.webaudio)

## License

MIT
