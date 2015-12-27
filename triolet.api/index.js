function TrioletAPI() {
  this.triolet = null;
}

TrioletAPI.prototype.setup = function() {
};

TrioletAPI.prototype.start = function() {
};

TrioletAPI.prototype.stop = function() {
};

TrioletAPI.prototype.sendToServer = function() {
  this.triolet.sendToServer.apply(this.triolet, arguments);
};

TrioletAPI.prototype.recvFromServer = function() {
};

TrioletAPI.prototype.process = function() {
};

module.exports = TrioletAPI;
