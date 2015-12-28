var API = require("@triolet-example/sine-tone").API;
var DSP = require("@triolet-example/sine-tone").DSP;
var Driver = require("triolet.driver.webaudio");
var triolet = require("triolet.bundle")();

window.AudioContext = window.AudioContext || window.webkitAudioContext;

window.addEventListener("DOMContentLoaded", function() {
  var audioContext = new AudioContext();

  triolet.compose({ api: new API(), dsp: new DSP(), driver: new Driver() });
  triolet.setup({ context: audioContext, bufferLength: 1024 });

  document.getElementById("button").onclick = function(e) {
    if (triolet.state === "suspended") {
      triolet.start();
      e.target.textContent = "stop";
    } else {
      triolet.stop();
      e.target.textContent = "start";
    }
  };
});
