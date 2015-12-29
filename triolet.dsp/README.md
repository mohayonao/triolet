# triolet.dsp
[![NPM Version](http://img.shields.io/npm/v/triolet.dsp.svg?style=flat-square)](https://www.npmjs.org/package/triolet.dsp)
[![License](http://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](http://mohayonao.mit-license.org/)

> base class for triolet DSP

## Installation

```
$ npm install triolet.dsp
```

## API
### TrioletDSP
- `constructor()`

#### Instance attributes
- `triolet: Triolet` _(required)_
- `sampleRate: number` _(implicit readonly)_
- `bufferLength: number` _(implicit readonly)_

#### Instance methods
- `setup(opts: object): void`
- `start(): void`
- `stop(): void`
- `sendToAPI(...args: any): void`
- `recvFromAPI(data: object): void`
- `process(bufL: Float32Array, bufR: Float32Array): void`

#### Triolet Interface
```
interface Triolet {
  dsp: TrioletDSP;
  sendToAPI(...args: any) => void;
}
```

## License

MIT
