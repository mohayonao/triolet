var API = require("@triolet-example/sine-tone").API;
var DSP = require("@triolet-example/sine-tone").DSP;
var triolet = require("triolet.worker/worker")(self);

triolet.compose({ api: new API(), dsp: new DSP() });

triolet.recvFromClient = function(data) {
  switch (data.type) {
  case "start":
    triolet.start();
    break;
  case "stop":
    triolet.stop();
    break;
  }
};
