# triolet
[![Build Status](http://img.shields.io/travis/mohayonao/triolet.svg?style=flat-square)](https://travis-ci.org/mohayonao/triolet)
[![License](http://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](http://mohayonao.mit-license.org/)

> 3 layered architecture for sound programming in JavaScript

## Installation

### triolet.bundle
[![NPM Version](http://img.shields.io/npm/v/triolet.bundle.svg?style=flat-square)](https://www.npmjs.org/package/triolet.bundle)

All components in the main thread. This architecture works on the browser and the Node.js

[![triolet.bundle](https://raw.githubusercontent.com/wiki/mohayonao/triolet/images/triolet.bundle.png)](https://github.com/mohayonao/triolet/tree/master/triolet.bundle)

```
$ npm install triolet.bundle
```

in the main thread

```js
const triolet = require("triolet.bundle")();
const Driver = require("pico.driver.webaudio");
const API = require("./api");
const DSP = require("./dsp");

let audioContext = new AudioContext();

triolet.compose({ api: new API(), dsp: new DSP(), driver: new Driver() });
triolet.setup({ context: audioContext, bufferLength: 1024 });

triolet.start();
```

### triolet.client
[![NPM Version](http://img.shields.io/npm/v/triolet.client.svg?style=flat-square)](https://www.npmjs.org/package/triolet.client)

`DRIVER` and `API` in the main thread; `DSP` in the worker thread. This architecture works on the browser.

[![triolet.client](https://raw.githubusercontent.com/wiki/mohayonao/triolet/images/triolet.client.png)](https://github.com/mohayonao/triolet/tree/master/triolet.client)

```
$ npm install triolet.client
```

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
const triolet = require("triolet.client/worker")(self);
const DSP = require("./dsp");

triolet.compose({ dsp: new DSP() });
```

### triolet.worker
[![NPM Version](http://img.shields.io/npm/v/triolet.worker.svg?style=flat-square)](https://www.npmjs.org/package/triolet.worker)

`DRIVER` in the main thread; `API` and `DSP` in the worker thread. This architecture works on the browser.

[![triolet.worker](https://raw.githubusercontent.com/wiki/mohayonao/triolet/images/triolet.worker.png)](https://github.com/mohayonao/triolet/tree/master/triolet.worker)

```
$ npm install triolet.worker
```

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
