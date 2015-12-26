function TrioletAPI() {
  this.triolet = null;
}

TrioletAPI.prototype.setup = function(opts) {
  this.triolet.setup(opts);
};

TrioletAPI.prototype.start = function() {
  this.triolet.start();
};

TrioletAPI.prototype.stop = function() {
  this.triolet.stop();
};

TrioletAPI.prototype.sendToServer = function() {
  this.triolet.sendToServer.apply(this.triolet, arguments);
};

TrioletAPI.prototype.recvFromServer = function() {
};

TrioletAPI.prototype.process = function() {
};

module.exports = TrioletAPI;
