var assign = require("object-assign");
var config = require("triolet._config");
var validator = require("triolet._validator");

function Triolet() {
  this.api = null;
  this.driver = null;
  this.server = null;
  this.sampleRate = 0;
  this.bufferLength = 0;
  this.state = "uninitialized";

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

  if (this.state !== "uninitialized" || !(validator.isAPI(api) && validator.isDriver(driver) && typeof workerPath === "string")) {
    throw new Error("Failed to execute 'compose' on 'Triolet'");
  }

  this.state = "composed";

  this.api = api;
  this.driver = driver;
  this.server = new Worker(workerPath);
  this.server.onmessage = function(e) {
    _this.recvFromServer(e.data);
  };

  api.triolet = this;
  driver.triolet = this;

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

  this.api.setup(opts);

  delete opts.context;
  delete opts.destination;

  this.server.postMessage(assign(opts, { type: ":setup" }));

  this._bufSlotCount = opts.bufferSlotCount;
  this._bufSlots = new Array(this._bufSlotCount);

  return this;
};

Triolet.prototype.start = function() {
  if (this.state === "suspended") {
    this.state = "running";
    this.driver.start();
    this.api.start();
    this.server.postMessage({ type: ":start" });
  }
  return this;
};

Triolet.prototype.stop = function() {
  if (this.state === "running") {
    this.state = "suspended";
    this.driver.stop();
    this.api.stop();
    this.server.postMessage({ type: ":stop" });
  }
  return this;
};

Triolet.prototype.sendToServer = function() {
  this.server.postMessage.apply(this.server, arguments);
};

Triolet.prototype.recvFromServer = function(data) {
  if (data instanceof Float32Array) {
    this._bufSlots[this._rdBufIndex] = data;
    this._rdBufIndex += 1;
    if (this._bufSlotCount <= this._rdBufIndex) {
      this._rdBufIndex = 0;
    }
  } else {
    this.api.recvFromServer(data);
  }
};

Triolet.prototype.process = function(bufL, bufR) {
  var buf = this._bufSlots[this._wrBufIndex];

  this.api.process(this.bufferLength);

  if (buf) {
    bufL.set(buf.subarray(0, this.bufferLength));
    bufR.set(buf.subarray(this.bufferLength));

    this.server.postMessage(buf, [ buf.buffer ]);
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
