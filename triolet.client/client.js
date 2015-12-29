var assign = require("object-assign");
var config = require("triolet._config");
var noop = function() {};

function Triolet() {
  this.api = null;
  this.driver = null;
  this.sampleRate = 0;
  this.bufferLength = 0;
  this.state = "uninitialized";

  this._worker = null;
  this._bufSlots = null;
  this._bufSlotCount = 0;
  this._rdBufIndex = 0;
  this._wrBufIndex = 0;
}

Triolet.prototype.compose = function(spec) {
  var _this = this;
  var api = spec.api;
  var driver = spec.driver;
  var workerPath = spec.workerPath;

  if (this.state !== "uninitialized") {
    throw new Error("Failed to execute 'compose' on 'Triolet'");
  }

  this.state = "composed";

  this.api = api;
  this.driver = driver;
  this._worker = new Worker(workerPath);
  this._worker.onmessage = function(e) {
    _this.recvFromWorker(e.data);
  };

  if (typeof api.recvFromDSP !== "function") {
    api.recvFromDSP = noop;
  }
  if (typeof api.process !== "function") {
    api.process = noop;
  }

  api.triolet = this;
  driver.processor = this;

  return this;
};

Triolet.prototype.setup = function(opts) {
  if (this.state !== "composed") {
    throw new Error("Failed to execute 'setup' on 'Triolet'");
  }

  this.state = "suspended";

  opts = assign(config(), opts);

  this.driver.setup(opts);
  this.sampleRate = this.driver.sampleRate;
  this.bufferLength = this.driver.bufferLength;

  opts = assign(opts, {
    sampleRate: this.sampleRate, bufferLength: this.bufferLength
  });

  if (typeof this.api.setup === "function") {
    this.api.setup(opts);
  }

  opts = JSON.parse(JSON.stringify(opts));
  opts = assign(opts, { type: ":setup" });

  this._worker.postMessage(opts);

  this._bufSlotCount = opts.bufferSlotCount;
  this._bufSlots = new Array(this._bufSlotCount);

  return this;
};

Triolet.prototype.start = function() {
  if (this.state === "suspended") {
    this.state = "running";
    this.driver.start();
    if (typeof this.api.start === "function") {
      this.api.start();
    }
    this._worker.postMessage({ type: ":start" });
  }
  return this;
};

Triolet.prototype.stop = function() {
  if (this.state === "running") {
    this.state = "suspended";
    this.driver.stop();
    if (typeof this.api.stop === "function") {
      this.api.stop();
    }
    this._worker.postMessage({ type: ":stop" });
  }
  return this;
};

Triolet.prototype.sendToDSP = function() {
  this._worker.postMessage.apply(this._worker, arguments);
};

Triolet.prototype.recvFromWorker = function(data) {
  if (data instanceof Float32Array) {
    this._bufSlots[this._rdBufIndex] = data;
    this._rdBufIndex += 1;
    if (this._bufSlotCount <= this._rdBufIndex) {
      this._rdBufIndex = 0;
    }
  } else {
    this.api.recvFromDSP(data);
  }
};

Triolet.prototype.process = function(bufL, bufR) {
  var buf = this._bufSlots[this._wrBufIndex];

  this.api.process(this.bufferLength);

  if (buf) {
    bufL.set(buf.subarray(0, this.bufferLength));
    bufR.set(buf.subarray(this.bufferLength));

    this._worker.postMessage(buf, [ buf.buffer ]);
    this._bufSlots[this._wrBufIndex] = null;

    this._wrBufIndex += 1;
    if (this._bufSlotCount <= this._wrBufIndex) {
      this._wrBufIndex = 0;
    }
  }
};

module.exports = function() {
  return new Triolet();
};
