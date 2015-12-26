# triolet.dsp

## Installation

```
$ npm install triolet.dsp
```

## API
### TrioletDSP
- `constructor()`

#### Instance attributes
- `triolet: Server` _(required)_
- `sampleRate: number` _(readonly)_
- `bufferLength: number` _(readonly)_

#### Instance methods
- `setup(opts: object): void`
- `start(): void`
- `stop(): void`
- `sendToClient(...args: any): void`
- `recvFromClient(data: object): void`
- `process(bufL: Float32Array, bufR: sampleRate): void`

#### Server Interface
```
interface Server {
  dsp: TrioletDSP;
  sendToClient(...args: any) => void;
}
```

## License

MIT
