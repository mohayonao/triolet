var assign = require("object-assign");
var config = require("triolet._config");

function Triolet() {
  this.driver = null;
  this.sampleRate = 0;
  this.bufferLength = 0;
  this.state = "uninitialized";

  this._worker = null;
  this._workerPath = null;
  this._pendingMessages = [];
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
  this._workerPath = workerPath;

  return this;
};

Triolet.prototype.setup = function(opts) {
  var _this = this;

  if (this.state !== "composed") {
    throw new Error("Failed to execute 'setup' on 'Triolet'");
  }

  this.state = "setup";

  opts = assign(config(), opts);

  this.driver.setup(opts);
  this.sampleRate = this.driver.sampleRate;
  this.bufferLength = this.driver.bufferLength;

  this.driver.context.createAudioWorker(this._workerPath).then(function(worker) {
    _this.worker = worker;
    _this._worker.onmessage = function(e) {
      _this.recvFromWorker(e.data);
    };

    _this.driver.node = worker.createNode(0, 2);

    opts = assign(opts, {
      sampleRate: this.sampleRate, bufferLength: this.bufferLength
    });

    opts = JSON.parse(JSON.stringify(opts));
    opts = assign(opts, { type: ":setup" });

    this._worker.postMessage(opts);

    this._pendingMessages.splice(0).forEach(function(args) {
      this._worker.postMessage.apply(this._worker, args);
    });

    _this.state = "suspended";
  });

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
  if (this._worker) {
    this._worker.postMessage.apply(this._worker, arguments);
  } else {
    this._pendingMessages.push(arguments);
  }
};

Triolet.prototype.recvFromWorker = function(data) {
  if (data && (data.type === ":start" || data.type === ":stop")) {
    this[data.type.substr(1)](data);
  }
}

module.exports = function() {
  return new Triolet();
};
