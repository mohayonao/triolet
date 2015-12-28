"use strict";

const assert = require("assert");
const sinon = require("sinon");
const _triolet = require("../");

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

describe("triolet.bundle", () => {
  let triolet, api, dsp, driver;

  beforeEach(() => {
    triolet = _triolet();
    api = createStub({ sampleRate: 22050, bufferLength: 1024 });
    dsp = createStub({ sampleRate: 22050, bufferLength: 64 });
    driver = createStub({ sampleRate: 44100, bufferLength: 1024 });
  });
  describe(".compose(spec: object): self", () => {
    it("compose components", () => {

      triolet.compose({ api, dsp, driver });

      assert(triolet.api === api);
      assert(triolet.dsp === dsp);
      assert(triolet.driver === driver);
      assert(api.triolet === triolet);
      assert(dsp.triolet === triolet);
      assert(driver.processor === triolet);
      assert(triolet.state === "composed");
    });
    it("throws an exception if call more than once", () => {
      triolet.compose({ api, dsp, driver });

      assert.throws(() => {
        triolet.compose({ api, dsp, driver });
      });
    });
  });
  describe(".setup(opts: object): self", () => {
    it("setup with configuration", () => {
      triolet.compose({ api, dsp, driver });
      triolet.setup({});

      assert(driver.setup.callCount === 1);
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
      triolet.compose({ api, dsp, driver });
      triolet.setup({});
      triolet.start();

      assert(driver.start.callCount === 1);
      assert(api.start.callCount === 1);
      assert(dsp.start.callCount === 1);
      assert(triolet.state === "running");
    });
    it("do nothing", () => {
      triolet.start();

      assert(driver.start.callCount === 0);
      assert(api.start.callCount === 0);
      assert(dsp.start.callCount === 0);
    });
  });
  describe(".stop(): self", () => {
    it("stop all components", () => {
      triolet.compose({ api, dsp, driver });
      triolet.setup({});
      triolet.start();
      triolet.stop();

      assert(driver.stop.callCount === 1);
      assert(api.stop.callCount === 1);
      assert(dsp.stop.callCount === 1);
      assert(triolet.state === "suspended");
    });
    it("do nothing", () => {
      triolet.stop();

      assert(driver.stop.callCount === 0);
      assert(api.stop.callCount === 0);
      assert(dsp.stop.callCount === 0);
    });
  });
  describe(".sendToClient(data: any)", () => {
    it("send to the client", () => {
      triolet.compose({ api, dsp, driver });
      triolet.sendToClient({ type: "message" });

      assert(api.recvFromServer.callCount === 1);
      assert.deepEqual(api.recvFromServer.args[0][0], { type: "message" });
    });
  });
  describe(".sendToServer(data: any)", () => {
    it("send to the server", () => {
      triolet.compose({ api, dsp, driver });
      triolet.sendToServer({ type: "message" });

      assert(dsp.recvFromClient.callCount === 1);
      assert.deepEqual(dsp.recvFromClient.args[0][0], { type: "message" });
    });
  });
  describe(".process(bufL: Float32Array, bufR: Float32Array): void", () => {
    it("works", () => {
      let bufL = new Float32Array(1024);
      let bufR = new Float32Array(1024);

      triolet.compose({ api, dsp, driver });
      triolet.setup({});
      triolet.process(bufL, bufR);

      assert(api.process.callCount === 16);
      assert(dsp.process.callCount === 16);
    });
  });
});
