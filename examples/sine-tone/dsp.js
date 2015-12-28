var TrioletDSP = require("triolet.dsp");

function DSP() {
  TrioletDSP.call(this);

  this._currentTime = 0;
  this._phaseL = 0;
  this._phaseR = 0;
  this._phaseLstep = 0;
  this._phaseRstep = 0;
  this._sched = [];
}
inherits(DSP, TrioletDSP);

DSP.prototype.setup = function(opts) {
  this.sampleRate = opts.sampleRate;
  this.bufferLength = opts.dspBufferLength;
  this._currentTimeIncr = this.bufferLength / this.sampleRate;
};

DSP.prototype.start = function() {
  this._currentTime = 0;
};

DSP.prototype.recvFromClient = function(data) {
  this._sched.push(data);
  this._sched.sort(function(a, b) {
    return a.playbackTime - b.playbackTime;
  });
};

DSP.prototype.process = function(bufL, bufR) {
  var phaseL = this._phaseL;
  var phaseR = this._phaseR;
  var phaseLstep = this._phaseLstep;
  var phaseRstep = this._phaseRstep;

  this._currentTime += this._currentTimeIncr;

  while (this._sched.length && this._sched[0].playbackTime <= this._currentTime) {
    this._execSched(this._sched.shift());
  }

  for (var i = 0, imax = this.bufferLength; i < imax; i++) {
    bufL[i] = Math.sin(phaseL) * 0.125;
    bufR[i] = Math.cos(phaseR) * 0.125;
    phaseL += phaseLstep;
    phaseR += phaseRstep;
  }

  this._phaseL = phaseL;
  this._phaseR = phaseR;
};

DSP.prototype._execSched = function(schedItem) {
  if (schedItem.type === "changeFrequency") {
    var freq = 440 * Math.pow(2, schedItem.noteNum / 12);

    if (schedItem.channel === 0) {
      this._phaseLstep = (freq / this.sampleRate) * Math.PI * 2;
    } else {
      this._phaseRstep = (freq / this.sampleRate) * Math.PI * 2;
    }
  }
}

function inherits(ctor, superCtor) {
  ctor.prototype = Object.create(superCtor.prototype, {
    constructor: { value: ctor, enumerable: false, writable: true, configurable: true }
  });
}

module.exports = DSP;
