var DSP = require("@triolet-example/sine-tone").DSP;
var triolet = require("triolet.client/worker")(self);

triolet.compose({ dsp: new DSP() });
