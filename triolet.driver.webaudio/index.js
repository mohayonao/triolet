var TrioletDriver = require("triolet.driver");

function inherits(ctor, superCtor) {
  ctor.prototype = Object.create(superCtor.prototype, {
    constructor: { value: ctor, enumerable: false, writable: true, configurable: true }
  });
}

function TrioletWebAudioDriver() {
  TrioletDriver.call(this);

  this._scp = null;
  this._context = null;
  this._destination = null;
}
inherits(TrioletWebAudioDriver, TrioletDriver);

TrioletWebAudioDriver.prototype.setup = function(opts) {
  TrioletDriver.prototype.setup.call(this, opts);

  if (opts.destination) {
    this._destination = opts.destination;
    this._context = this._destination.context;
  } else {
    this._context = opts.context;
    this._destination = this._context.destination;
  }

  this.sampleRate = this._context.sampleRate;
};

TrioletWebAudioDriver.prototype.start = function() {
  var processor = this.processor;
  var bufL = new Float32Array(this.bufferLength);
  var bufR = new Float32Array(this.bufferLength);

  if (this._context !== null && this.processor !== null && this._scp === null) {
    this._scp = this._context.createScriptProcessor(this.bufferLength, 0, 2);
    if (typeof AudioBuffer.prototype.copyToChannel === "function") {
      this._scp.onaudioprocess = function(e) {
        var buf = e.outputBuffer;

        processor.process(bufL, bufR);

        buf.copyToChannel(bufL, 0);
        buf.copyToChannel(bufR, 1);
      };
    } else {
      this._scp.onaudioprocess = function(e) {
        var buf = e.outputBuffer;

        processor.process(bufL, bufR);

        buf.getChannelData(0).set(bufL);
        buf.getChannelData(1).set(bufR);
      };
    }
    this._scp.connect(this._destination);
  }
};

TrioletWebAudioDriver.prototype.stop = function() {
  if (this._scp !== null) {
    this._scp.disconnect();
    this._scp = null;
  }
};

module.exports = TrioletWebAudioDriver;
