var DSP = require("@triolet-example/sine-tone").DSP;
var triolet = require("triolet.browser/worker")(self);

triolet.compose({ dsp: new DSP() });
