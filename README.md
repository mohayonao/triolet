# triolet
[![Build Status](http://img.shields.io/travis/mohayonao/triolet.svg?style=flat-square)](https://travis-ci.org/mohayonao/triolet)
[![License](http://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](http://mohayonao.mit-license.org/)

> universal architecture for sound programming in JavaScript

## Installation

### triolet.bundle
[![NPM Version](http://img.shields.io/npm/v/triolet.bundle.svg?style=flat-square)](https://www.npmjs.org/package/triolet.bundle)

All components in the main thread. This architecture works on the browser and the Node.js

[![triolet.bundle](https://raw.githubusercontent.com/wiki/mohayonao/triolet/images/triolet.bundle.png)](https://github.com/mohayonao/triolet/tree/master/triolet.bundle)

```
$ npm install triolet.bundle
```

### triolet.client
[![NPM Version](http://img.shields.io/npm/v/triolet.client.svg?style=flat-square)](https://www.npmjs.org/package/triolet.client)

`DRIVER` and `API` in the main thread; `DSP` in the worker thread. This architecture works on the browser.

[![triolet.client](https://raw.githubusercontent.com/wiki/mohayonao/triolet/images/triolet.client.png)](https://github.com/mohayonao/triolet/tree/master/triolet.client)

```
$ npm install triolet.client
```

### triolet.worker
[![NPM Version](http://img.shields.io/npm/v/triolet.worker.svg?style=flat-square)](https://www.npmjs.org/package/triolet.worker)

`DRIVER` in the main thread; `API` and `DSP` in the worker thread. This architecture works on the browser.

[![triolet.worker](https://raw.githubusercontent.com/wiki/mohayonao/triolet/images/triolet.worker.png)](https://github.com/mohayonao/triolet/tree/master/triolet.worker)

```
$ npm install triolet.worker
```

## Interfaces

- [triolet.api](https://github.com/mohayonao/triolet/tree/master/triolet.api)
- [triolet.dsp](https://github.com/mohayonao/triolet/tree/master/triolet.dsp)
- [triolet.driver](https://github.com/mohayonao/triolet/tree/master/triolet.driver)


## Audio Drivers

- [triolet.driver.webaudio](https://github.com/mohayonao/triolet/tree/master/triolet.driver.webaudio)
- [triolet.driver.nodeaudio](https://github.com/mohayonao/triolet/tree/master/triolet.driver.nodeaudio)

## License

MIT
