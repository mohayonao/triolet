var API = require("@triolet-example/sine-tone").API;
var DSP = require("@triolet-example/sine-tone").DSP;
var Driver = require("pico.driver.nodeaudio");
var triolet = require("triolet.bundle")();

triolet.compose({ api: new API(), dsp: new DSP(), driver: new Driver() });
triolet.setup({ bufferLength: 1024 });

triolet.start();
