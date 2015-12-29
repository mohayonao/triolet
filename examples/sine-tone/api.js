function API() {
}

API.prototype.setup = function(opts) {
  this.sampleRate = opts.sampleRate;
  this._schedOffset = +opts.schedOffset || 0;
};

API.prototype.start = function() {
  this._counter = 0;
  this._currentTime = 0;
};

API.prototype.process = function(inNumSamples) {
  this._currentTime += inNumSamples / this.sampleRate;

  if (this._counter <= 0) {
    this.triolet.sendToDSP({
      type: "changeFrequency",
      playbackTime: this._currentTime + this._schedOffset,
      noteNum: sample([ 0, 2, 4, 5, 7, 9, 11 ]),
      channel: sample([ 0, 1 ])
    })
    this._counter += this.sampleRate * 0.25;
  }
  this._counter -= inNumSamples;
};

API.prototype.recvFromClient = function(data) {
  this[data.type](data);
};

function sample(list) {
  return list[Math.floor(Math.random() * list.length)];
}

module.exports = API;
