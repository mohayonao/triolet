function TrioletAPI() {
  this.triolet = null;
}

TrioletAPI.prototype.setup = function() {
};

TrioletAPI.prototype.start = function() {
};

TrioletAPI.prototype.stop = function() {
};

TrioletAPI.prototype.sendToDSP = function() {
  this.triolet.sendToDSP.apply(this.triolet, arguments);
};

TrioletAPI.prototype.recvFromDSP = function() {
};

TrioletAPI.prototype.process = function() {
};

module.exports = TrioletAPI;
