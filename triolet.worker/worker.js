var assign = require("object-assign");
var config = require("triolet._config");

function Triolet(self) {
  var _this = this;

  this.self = self;
  this.api = null;
  this.dsp = null;
  this.sampleRate = 0;
  this.bufferLength = 0;
  this.state = "uninitialized";
  this.timerAPI = global;

  this._bufSlots = null;
  this._bufSlotCount = 0;
  this._rdBufIndex = 0;
  this._wrBufIndex = 0;
  this._dspBufLength = 0;
  this._dspBufL = null;
  this._dspBufR = null;
  this._timerId = 0;

  self.onmessage = function(e) {
    var data = e.data;

    if (data instanceof Float32Array) {
      _this._bufSlots[_this._rdBufIndex] = data;
      _this._rdBufIndex += 1;
      if (_this._bufSlotCount <= _this._rdBufIndex) {
        _this._rdBufIndex = 0;
      }
    } else if (data.type[0] === ":") {
      _this[data.type.substr(1)](data);
    } else {
      _this.recvFromClient(data);
    }
  };
}

Triolet.prototype.compose = function(spec) {
  var api = spec.api;
  var dsp = spec.dsp;

  if (this.state !== "uninitialized") {
    throw new Error("Failed to execute 'compose' on 'Triolet'");
  }

  this.state = "composed";

  this.api = api;
  this.dsp = dsp;

  api.triolet = this;
  dsp.triolet = this;

  return this;
};

Triolet.prototype.setup = function(opts) {
  if (this.state !== "composed") {
    throw new Error("Failed to execute 'setup' on 'Triolet'");
  }

  this.state = "suspended";

  opts = assign(config(), opts);

  this.sampleRate = opts.sampleRate;
  this.bufferLength = opts.bufferLength;

  opts = assign(opts, {
    sampleRate: this.sampleRate, bufferLength: this.bufferLength
  });

  this.api.setup(opts);
  this.dsp.setup(opts);
  this._bufSlotCount = opts.bufferSlotCount;
  this._bufSlots = new Array(this._bufSlotCount);

  for (var i = 0; i < this._bufSlots.length; i++) {
    this._bufSlots[i] = new Float32Array(this.bufferLength * 2);
  }

  this._dspBufLength = this.dsp.bufferLength;
  this._dspBufL = new Float32Array(this._dspBufLength);
  this._dspBufR = new Float32Array(this._dspBufLength);

  return this;
};

Triolet.prototype.start = function() {
  var _this = this;
  var interval = Math.floor((this.bufferLength / this.sampleRate) * 500);

  if (this.state === "suspended") {
    this.state = "running";
    this.self.postMessage({ type: ":start" });
    this.api.start();
    this.dsp.start();
    this._timerId = this.timerAPI.setInterval(function() {
      _this.process();
    }, interval);
  }

  return this;
};

Triolet.prototype.stop = function() {
  if (this.state === "running") {
    this.state = "suspended";
    this.self.postMessage({ type: ":stop" });
    this.api.stop();
    this.dsp.stop();
    this.timerAPI.clearInterval(this._timerId);
    this._timerId = 0;
  }

  return this;
};

Triolet.prototype.sendToClient = function(data) {
  this.api.recvFromServer(data);
};

Triolet.prototype.sendToServer = function(data) {
  this.dsp.recvFromClient(data);
};

Triolet.prototype.process = function() {
  var buf = this._bufSlots[this._wrBufIndex];
  var bufIndex = 0;
  var bufLength = this.bufferLength;
  var dspBufLength = this._dspBufLength;
  var dspBufL = this._dspBufL;
  var dspBufR = this._dspBufR;

  if (buf) {
    while (bufIndex < bufLength) {
      this.api.process(dspBufLength);
      this.dsp.process(dspBufL, dspBufR);

      buf.set(dspBufL, bufIndex);
      buf.set(dspBufR, bufIndex + bufLength);

      bufIndex += dspBufLength;
    }

    this.self.postMessage(buf, [ buf.buffer ]);
    this._bufSlots[this._wrBufIndex] = null;

    this._wrBufIndex += 1;
    if (this._bufSlotCount <= this._wrBufIndex) {
      this._wrBufIndex = 0;
    }
  }
};

module.exports = function(self) {
  return new Triolet(self);
};
