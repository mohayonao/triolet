var Driver = require("triolet.driver.webaudio");
var triolet = require("triolet.worker/client")();

window.AudioContext = window.AudioContext || window.webkitAudioContext;

window.addEventListener("DOMContentLoaded", function() {
  var audioContext = new AudioContext();

  triolet.compose({ driver: new Driver(), workerPath: "./bundle.worker.js" });
  triolet.setup({ context: audioContext, bufferLength: 1024 });

  document.getElementById("button").onclick = function(e) {
    if (triolet.state === "suspended") {
      triolet.sendToServer({ type: "start" });
      e.target.textContent = "stop";
    } else {
      triolet.sendToServer({ type: "stop" });
      e.target.textContent = "start";
    }
  };
});
