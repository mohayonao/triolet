var API = require("@triolet-example/sine-tone").API;
var Driver = require("triolet.driver.webaudio");
var triolet = require("triolet.client/client")();

window.AudioContext = window.AudioContext || window.webkitAudioContext;

window.addEventListener("DOMContentLoaded", function() {
  var audioContext = new AudioContext();

  triolet.compose({ api: new API(), driver: new Driver(), workerPath: "./bundle.worker.js" });
  triolet.setup({ context: audioContext, bufferLength: 1024, schedOffset: 0.25 });

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
