# triolet.driver.nodeaudio

## Installation

```
$ npm install triolet.driver.nodeaudio
```

## API
### TrioletNodeAudioDriver
- `constructor()`

#### Instance attributes
- `triolet: Server` _(required)_
- `sampleRate: number` _(readonly)_
- `bufferLength: number` _(readonly)_

#### Instance methods
- `setup(opts: object): void`
  - `opts.sampleRate: number`
  - `opts.bufferLength: number`
- `start(): void`
- `stop(): void`

#### Server Interface
```
interface Server {
  driver: TrioletDriver;
  process(bufL: Float32Array, bufR: Float32Array) => void;
}
```

## License

MIT
