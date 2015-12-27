# triolet.bundle

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
- `driver: TrioletDriver`
- `sampleRate: number` _(readonly)_
- `bufferLength: number` _(readonly)_

#### Instance methods
- `compose(spec: object): triolet`
- `setup(opts: object): triolet`
- `start(): triolet`
- `stop(): triolet`
- `sendToClient(data: any): void`
- `sendToServer(data: any): void`

## License

MIT
