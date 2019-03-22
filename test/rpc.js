'use strict';

const assert = require('chai').assert;
const amqp_pattern = require('../index');

const rpc1 = "rpc1";
const rpc2 = "rpc2";
const rpc3 = "rpc3";
const rpc4 = "rpc4";
const rpc5 = "rpc5";

describe('RPC', () => {
  var client, server1, server2;

  before(async () => {
    client = new amqp_pattern('amqp://localhost');
    server1 = new amqp_pattern('amqp://localhost');
    server2 = new amqp_pattern('amqp://localhost');
    await client.init();
    await server1.init();
    await server2.init();
  });
  after(async () => {
    await (() => {
      return new Promise(resolve => setTimeout(resolve, 300));
    })();
    client.dispose();
    server1.dispose();
    server2.dispose();
  });
  it('register RPC server', async () => {
    try {
      server1.rpcServer(rpc1, async (a) => {
        if (a == null)
          throw "Expected value";
        return a + "_test";
      });
    } catch (err) {
      assert.fail(err);
    }
  });
  it('register more than one RPC server', async () => {
    try {
      server1.rpcServer(rpc2, async (a) => {
        return await server1.rpcCall(rpc1, a) + "_test2";
      });
    } catch (err) {
      assert.fail(err);
    }
  });
  it('performs RPC call', async () => {
    try {
      var x = await client.rpcCall(rpc1, 1);
      assert.equal(x, "1_test", "differ");
    } catch (err) {
      assert.fail(err);
    }
  });
  it('performs RPC call who retrieves error', async () => {
    try {
      var x = await client.rpcCall(rpc1, null);
      assert.fail(x);
    } catch (err) {
      assert.equal(err, "Expected value", "differ");
    }
  });
  it('performs RPC call who performs another call', async () => {
    try {
      var x = await client.rpcCall(rpc2, 12);
      assert.equal(x, "12_test_test2", "differ");
    } catch (err) {
      assert.fail(err);
    }
  });
  it('performs RPC call to multiple servers', async () => {
    try {
      var total = 0;

      server1.rpcServer(rpc3, async (a) => {
        total++;
        return a + "_server1";
      });

      server2.rpcServer(rpc3, async (a) => {
        total++;
        return a + "_server2";
      });

      var x = await client.rpcCall(rpc3, 1);
      setTimeout(function() {
        assert.equal(total, 1, "only one call");
      }, 500);
    } catch (err) {
      assert.fail(err);
    }
  });
  it('performs RPC call to non existing server with timeout', async () => {
    try {
      var x = await client.rpcCall(rpc4, 12, .2);
      assert.fail(x);
    } catch (err) {
      assert.equal(err, "rpc4 timeout", "no timeout error");
    }
  });
  it('performs RPC call to existing server with timeout', async () => {
    try {
      server2.rpcServer(rpc5, async (a) => {
        await (() => {
          return new Promise(resolve => setTimeout(resolve, 300));
        })();
        return a + "_test";
      });
      var x = await client.rpcCall(rpc5, 12, .2);
      assert.fail(x);
    } catch (err) {
      assert.equal(err, "rpc5 timeout", "no timeout error");
    }
  })
});
