'use strict';

const assert = require('chai').assert;
const amqp_pattern = require('../index');
const logger = require('tracer').colorConsole({level:'debug'});

const rpc1 = "rpcS1";

describe('RPC Strategy', () => {
  var x, _a = 0, _b = 0;

  before(async () => {
    x = new amqp_pattern('amqp://localhost');
    await x.init();
  });
  after(async () => {
    await (() => {
      return new Promise(resolve => setTimeout(resolve, 300));
    })();
    x.dispose();
  });
  it('register RPC strategy', async () => {
    try {
      x.rpcStrategy(rpc1, async (a) => {
        if (a<50)
          return "a";
        return "b";
      }, {
        "a": async (a) => { _a+=a;  },
        "b": async (a) => { _b+=a; }
      });
    } catch (err) {
      assert.fail(err);
    }
  });
  it('call RPC strategy', async() => {
    try {
      for (var i = 0; i<100; i++)
        await x.rpcCall(rpc1, i);
    } catch (err) {
      assert.fail(err);
    }
  });
  describe("check values", () => {
    it('_a', async () => {
      assert.equal(_a, 1225);
    });
    it('_b', async () => {
      assert.equal(_b, 3725);
    });
  });
});
