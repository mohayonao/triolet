var config = require("triolet._config")();

function TrioletDriver() {
  this.triolet = null;
  this.sampleRate = 0;
  this.bufferLength = 0;
}

TrioletDriver.prototype.setup = function(opts) {
  this.sampleRate = Math.max(0, +opts.sampleRate|0) || config.sampleRate;
  this.bufferLength = Math.max(0, +opts.bufferLength|0) || config.bufferLength;
};

TrioletDriver.prototype.start = function() {
};

TrioletDriver.prototype.stop = function() {
};

module.exports = TrioletDriver;
