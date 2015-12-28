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
    recvFromServer: sinon.spy(),
    recvFromClient: sinon.spy(),
    process: sinon.spy(),
    sampleRate: opts.sampleRate,
    bufferLength: opts.bufferLength
  };
}

describe("triolet.worker/worker", () => {
  let triolet, self, api, dsp;

  beforeEach(() => {
    tickable.clearAllTimers();
    self = createWorkerGlobalScope();
    triolet = _triolet(self);
    triolet.timerAPI = tickable;
    api = createStub({ sampleRate: 44100, bufferLength: 64 });
    dsp = createStub({ sampleRate: 44100, bufferLength: 64 });
  });
  describe(".compose(spec: object): self", () => {
    it("compose components", () => {

      triolet.compose({ api, dsp });

      assert(triolet.api === api);
      assert(triolet.dsp === dsp);
      assert(api.triolet === triolet);
      assert(dsp.triolet === triolet);
      assert(triolet.state === "composed");
    });
    it("throws an exception if call more than once", () => {
      triolet.compose({ api, dsp });

      assert.throws(() => {
        triolet.compose({ api, dsp });
      });
    });
  });
  describe(".setup(opts: object): self", () => {
    it("setup with configuration", () => {
      triolet.compose({ api, dsp });
      triolet.setup({});

      assert(api.setup.callCount === 1);
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
      triolet.compose({ api, dsp });
      triolet.setup({});
      triolet.start();

      assert(self.postMessage.callCount === 1);
      assert.deepEqual(self.postMessage.args[0][0], { type: ":start" });
      assert(api.start.callCount === 1);
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
      triolet.compose({ api, dsp });
      triolet.setup({});
      triolet.start();
      triolet.stop();

      assert(self.postMessage.callCount === 2);
      assert.deepEqual(self.postMessage.args[1][0], { type: ":stop" });
      assert(api.stop.callCount === 1);
      assert(dsp.stop.callCount === 1);
      assert(triolet.state === "suspended");
    });
    it("do nothing", () => {
      triolet.stop();

      assert(dsp.stop.callCount === 0);
    });
  });
  describe(".sendToClient(data: any)", () => {
    it("send to the server", () => {
      triolet.compose({ api, dsp });
      triolet.sendToClient({ type: "message" });

      assert(api.recvFromServer.callCount === 1);
      assert.deepEqual(api.recvFromServer.args[0][0], { type: "message" });
    });
  });
  describe(".sendToServer(data: any)", () => {
    it("receive from the server", () => {
      triolet.compose({ api, dsp });
      triolet.sendToServer({ type: "message" });

      assert(dsp.recvFromClient.callCount === 1);
      assert.deepEqual(dsp.recvFromClient.args[0][0], { type: "message" });
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

      triolet.compose({ api, dsp });
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
