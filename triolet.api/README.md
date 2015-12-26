# triolet.api

## Installation

```
$ npm install triolet.api
```

## API
### TrioletAPI
- `constructor()`

#### Instance attributes
- `triolet: Server` _(required)_

#### Instance methods
- `setup(opts: object): void`
- `start(): void`
- `stop(): void`
- `sendToServer(...args: any): void`
- `recvFromServer(data: object): void`
- `process(inNumSamples: number): void`

#### Server Interface
```
interface Server {
  api: TrioletAPI;
  setup(opts: object) => void;
  start() => void;
  stop() => void;
  sendToServer(...args: any) => void;
}
```

## License

MIT
