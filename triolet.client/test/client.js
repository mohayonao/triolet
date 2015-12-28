"use strict";

const assert = require("assert");
const sinon = require("sinon");
const _triolet = require("../client");

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

describe("triolet.client/client", () => {
  let triolet, api, driver;
  let Worker, worker;

  before(() => {
    Worker = global.Worker;
    global.Worker = class Worker {
      constructor() {
        worker = this;
        this.postMessage = sinon.spy();
        this.onmessage = sinon.spy();
      }
    }
  });
  beforeEach(() => {
    triolet = _triolet();
    api = createStub({ sampleRate: 22050, bufferLength: 1024 });
    driver = createStub({ sampleRate: 44100, bufferLength: 1024 });
  });
  after(() => {
    global.Worker = Worker;
  });
  describe(".compose(spec: object): self", () => {
    it("compose components", () => {

      triolet.compose({ api, driver });

      assert(triolet.api === api);
      assert(triolet.driver === driver);
      assert(api.triolet === triolet);
      assert(driver.triolet === triolet);
      assert(triolet.state === "composed");
    });
    it("throws an exception if call more than once", () => {
      triolet.compose({ api, driver });

      assert.throws(() => {
        triolet.compose({ api, driver });
      });
    });
  });
  describe(".setup(opts: object): self", () => {
    it("setup with configuration", () => {
      triolet.compose({ api, driver });
      triolet.setup({});

      assert(driver.setup.callCount === 1);
      assert(api.setup.callCount === 1);
      assert(worker.postMessage.callCount === 1);
      assert(worker.postMessage.args[0][0].type === ":setup");
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
      triolet.compose({ api, driver });
      triolet.setup({});
      triolet.start();

      assert(driver.start.callCount === 1);
      assert(api.start.callCount === 1);
      assert(worker.postMessage.callCount === 2);
      assert(worker.postMessage.args[1][0].type === ":start");
      assert(triolet.state === "running");
    });
    it("do nothing", () => {
      triolet.start();

      assert(driver.start.callCount === 0);
      assert(api.start.callCount === 0);
    });
  });
  describe(".stop(): self", () => {
    it("stop all components", () => {
      triolet.compose({ api, driver });
      triolet.setup({});
      triolet.start();
      triolet.stop();

      assert(driver.stop.callCount === 1);
      assert(api.stop.callCount === 1);
      assert(worker.postMessage.callCount === 3);
      assert(worker.postMessage.args[2][0].type === ":stop");
      assert(triolet.state === "suspended");
    });
    it("do nothing", () => {
      triolet.stop();

      assert(driver.stop.callCount === 0);
      assert(api.stop.callCount === 0);
    });
  });
  describe(".sendToServer(data: any)", () => {
    it("send to the server", () => {
      triolet.compose({ api, driver });
      triolet.sendToServer({ type: "message" });

      assert(worker.postMessage.callCount === 1);
      assert.deepEqual(worker.postMessage.args[0][0], { type: "message" });
    });
  });
  describe(".recvFromServer(data: any)", () => {
    it("receive from the server", () => {
      triolet.compose({ api, driver });
      triolet.recvFromServer({ type: "message" });

      assert(api.recvFromServer.callCount === 1);
      assert.deepEqual(api.recvFromServer.args[0][0], { type: "message" });
    });
  });
  describe(".process(bufL: Float32Array, bufR: Float32Array): void", () => {
    it("works", () => {
      let bufL = new Float32Array(1024);
      let bufR = new Float32Array(1024);
      let processed = new Float32Array(2048);

      for (let i = 0; i < 2048; i++) {
        processed[i] = Math.random() - 0.5;
      }

      triolet.compose({ api, driver });
      triolet.setup({});
      triolet.process(bufL, bufR);

      assert(api.process.callCount === 1);

      triolet.recvFromServer(processed);
      triolet.process(bufL, bufR);
      assert.deepEqual(bufL, processed.subarray(0, 1024));
      assert.deepEqual(bufR, processed.subarray(1024, 2048));
      assert(api.process.callCount === 2);
      assert(worker.postMessage.args[1][0] === processed);
      assert.deepEqual(worker.postMessage.args[1][1], [ processed.buffer ]);
    });
  });
});
