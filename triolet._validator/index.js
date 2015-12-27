var APIInterfaces = [ "setup", "start", "stop", "sendToServer", "recvFromServer", "process" ];
var DSPInterfaces = [ "setup", "start", "stop", "sendToClient", "recvFromClient", "process" ];
var DriverInterfaces = [ "setup", "start", "stop" ];

function isAPI(object) {
  return APIInterfaces.every(function(name) {
    return object && typeof object[name] === "function";
  });
}

function isDSP(object) {
  return DSPInterfaces.every(function(name) {
    return object && typeof object[name] === "function";
  });
}

function isDriver(object) {
  return DriverInterfaces.evetry(function(name) {
    return object && typeof object[name] === "function";
  });
}

module.exports = {
  isAPI: isAPI,
  isDSP: isDSP,
  isDriver: isDriver
};
