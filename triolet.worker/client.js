var assign = require("object-assign");
var config = require("triolet._config");

function Triolet() {
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
  var driver = spec.driver;
  var workerPath = spec.workerPath;

  if (this.state !== "uninitialized") {
    throw new Error("Failed to execute 'compose' on 'Triolet'");
  }

  this.state = "composed";

  this.driver = driver;
  this._worker = new Worker(workerPath);
  this._worker.onmessage = function(e) {
    _this.recvFromWorker(e.data);
  };

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
  }
  return this;
};

Triolet.prototype.stop = function() {
  if (this.state === "running") {
    this.state = "suspended";
    this.driver.stop();
  }
  return this;
};

Triolet.prototype.sendToWorker = function() {
  this._worker.postMessage.apply(this._worker, arguments);
};

Triolet.prototype.recvFromWorker = function(data) {
  if (data instanceof Float32Array) {
    this._bufSlots[this._rdBufIndex] = data;
    this._rdBufIndex += 1;
    if (this._bufSlotCount <= this._rdBufIndex) {
      this._rdBufIndex = 0;
    }
  } else if (data && (data.type === ":start" || data.type === ":stop")) {
    this[data.type.substr(1)](data);
  }
};

Triolet.prototype.process = function(bufL, bufR) {
  var buf = this._bufSlots[this._wrBufIndex];

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
