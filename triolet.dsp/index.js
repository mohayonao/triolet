var config = require("triolet._config")();

function TrioletDSP() {
  this.triolet = null;
  this.sampleRate = 0;
  this.bufferLength = 0;
}

TrioletDSP.prototype.setup = function(opts) {
  this.sampleRate = Math.max(0, +opts.sampleRate|0) || config.sampleRate;
  this.bufferLength = Math.max(0, +opts.bufferLength|0) || config.dspBufferLength;
};

TrioletDSP.prototype.start = function() {
};

TrioletDSP.prototype.stop = function() {
};

TrioletDSP.prototype.sendToAPI = function() {
  this.triolet.sendToAPI.apply(this.triolet, arguments);
};

TrioletDSP.prototype.recvFromAPI = function() {
};

TrioletDSP.prototype.process = function() {
};

module.exports = TrioletDSP;
