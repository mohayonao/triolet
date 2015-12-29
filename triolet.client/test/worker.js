"use strict";

const assert = require("assert");
const sinon = require("sinon");
const tickable = require("tickable-timer");
const _triolet = require("../worker");

function createWorkerGlobalScope() {
  return {
    postMessage: sinon.spy(),
    onmessage: sinon.spy()
  };
}

function createStub(opts) {
  return {
    setup: sinon.spy(),
    start: sinon.spy(),
    stop: sinon.spy(),
    recvFromDSP: sinon.spy(),
    recvFromAPI: sinon.spy(),
    process: sinon.spy(),
    sampleRate: opts.sampleRate,
    bufferLength: opts.bufferLength
  };
}

describe("triolet.client/worker", () => {
  let triolet, self, dsp;

  beforeEach(() => {
    tickable.clearAllTimers();
    self = createWorkerGlobalScope();
    triolet = _triolet(self);
    triolet.timerAPI = tickable;
    dsp = createStub({ sampleRate: 44100, bufferLength: 64 });
  });
  describe(".compose(spec: object): self", () => {
    it("compose components", () => {

      triolet.compose({ dsp });

      assert(triolet.dsp === dsp);
      assert(dsp.triolet === triolet);
      assert(triolet.state === "composed");
    });
    it("throws an exception if call more than once", () => {
      triolet.compose({ dsp });

      assert.throws(() => {
        triolet.compose({ dsp });
      });
    });
  });
  describe(".setup(opts: object): self", () => {
    it("setup with configuration", () => {
      triolet.compose({ dsp });
      triolet.setup({});

      assert(dsp.setup.callCount === 1);
      assert(triolet.state === "suspended");
    });
    it("throws an exception if not calling compose first", () => {
      assert.throws(() => {
        triolet.setup({});
      });
    });
  });
  describe(".start(): self", () => {
    it("start all components", () => {
      triolet.compose({ dsp });
      triolet.setup({});
      triolet.start();

      assert(dsp.start.callCount === 1);
      assert(triolet.state === "running");
    });
    it("do nothing", () => {
      triolet.start();

      assert(dsp.start.callCount === 0);
    });
  });
  describe(".stop(): self", () => {
    it("stop all components", () => {
      triolet.compose({ dsp });
      triolet.setup({});
      triolet.start();
      triolet.stop();

      assert(dsp.stop.callCount === 1);
      assert(triolet.state === "suspended");
    });
    it("do nothing", () => {
      triolet.stop();

      assert(dsp.stop.callCount === 0);
    });
  });
  describe(".sendToAPI(data: any)", () => {
    it("send to the server", () => {
      triolet.compose({ dsp });
      triolet.sendToAPI({ type: "message" });

      assert(self.postMessage.callCount === 1);
      assert.deepEqual(self.postMessage.args[0][0], { type: "message" });
    });
  });
  describe(".recvFromWorkerClient(data: any)", () => {
    it("receive from the server", () => {
      triolet.compose({ dsp });
      triolet.recvFromWorkerClient({ type: "message" });

      assert(dsp.recvFromAPI.callCount === 1);
      assert.deepEqual(dsp.recvFromAPI.args[0][0], { type: "message" });
    });
    it("call triolet method", () => {
      triolet.start = sinon.spy();
      triolet.compose({ dsp });
      triolet.recvFromWorkerClient({ type: ":start" });

      assert(triolet.start.callCount === 1);
    });
  });
  describe(".process(): void", () => {
    it("works", () => {
      let bufL = new Float32Array(1024);
      let bufR = new Float32Array(1024);
      let processed = new Float32Array(2048);

      for (let i = 0; i < 2048; i++) {
        processed[i] = Math.random() - 0.5;
      }

      triolet.compose({ dsp });
      triolet.setup({ sampleRate: 44100, bufferLength: 1024, bufferSlotCount: 1 });

      triolet.process();
      assert(dsp.process.callCount === 16);
      assert(self.postMessage.callCount === 1);
      assert(self.postMessage.args[0][0] instanceof Float32Array);
      assert(self.postMessage.args[0][1][0] === self.postMessage.args[0][0].buffer);

      triolet.process();
      assert(dsp.process.callCount === 16);
      assert(self.postMessage.callCount === 1);
    });
  });
});
