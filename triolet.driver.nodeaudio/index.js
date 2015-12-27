var Readable = require("stream").Readable;
var Speaker = require("speaker");
var TrioletDriver = require("triolet.driver");

function inherits(ctor, superCtor) {
  ctor.prototype = Object.create(superCtor.prototype, {
    constructor: { value: ctor, enumerable: false, writable: true, configurable: true }
  });
}

function TrioletNodeAudioDriver() {
  TrioletDriver.call(this);

  this._node = null;
}
inherits(TrioletNodeAudioDriver, TrioletDriver);

TrioletNodeAudioDriver.prototype.start = function() {
  var triolet = this.triolet;
  var bufferLength = this.bufferLength;
  var bufL = new Float32Array(bufferLength);
  var bufR = new Float32Array(bufferLength);
  var buf = new Buffer(bufferLength * 2 * 4);
  var node;

  if (this.triolet !== null && this._node === null) {
    node = new Readable();
    node._read = function() {
      triolet.process(bufL, bufR);

      for (var i = 0; i < bufferLength; i++) {
        buf.writeFloatLE(bufL[i], i * 8 + 0);
        buf.writeFloatLE(bufR[i], i * 8 + 4);
      }

      node.push(buf);
    };
    node.pipe(new Speaker({
      sampleRate: this.sampleRate,
      samplesPerFrame: bufferLength,
      channels: 2,
      float: true
    }));

    this._node = node;
  }
};

TrioletNodeAudioDriver.prototype.stop = function() {
  if (this._node !== null) {
    this._node.emit("end");
    this._node = null;
  }
};

module.exports = TrioletNodeAudioDriver;
