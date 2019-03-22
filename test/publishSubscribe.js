'use strict';

const assert = require('chai').assert;
const amqp_pattern = require('../index');
const logger = require('tracer').colorConsole();

const exchange1 = "exchange1";
const exchange2 = "exchange2";
const exchange3 = "exchange3";

function aux(xName, type, pattern1, pattern2, route1, route2, _t1, _t2, _t1x) {
  var server;
  var f1 = false;
  var t1 = 0, t2 = 0, t1x = 0;

  before(async () => {
    server = new amqp_pattern('amqp://localhost');
    await server.init();
  });
  after(async () => {
    await (() => {
      return new Promise(resolve => setTimeout(resolve, 300));
    })();
    server.dispose();
  });
  it('create exchange', async () => {
    try {
      await server.initExchange(xName, type);
    } catch (err) {
      assert.fail(err);
    }
  });
  it('subscribe', async () => {
    try {

      await server.initQueue(xName + "_1");
      await server.subscribe(xName + "_1", xName, pattern1);
      await (() => {
        return new Promise(resolve => setTimeout(resolve, 200));
      })();
      server.consume(xName + "_1", async (x) => {
        t1x++;
        if (f1) {
          t1++;
        } else {
          f1 = true;
          throw "try again";
        }
      });
    } catch (err) {
      assert.fail(err);
    }
  });
  it('subscribe another queue', async () => {
    try {
      await server.initQueue(xName + "_2");
      await server.subscribe(xName + "_2", xName, pattern2);
      await (() => {
        return new Promise(resolve => setTimeout(resolve, 200));
      })();
      server.consume(xName + "_2", async (x) => {
        t2+=x;
      });
    } catch (err) {
      assert.fail(err);
    }
  });
  it('publish some items', async () => {
    try {
      for (var i = 0; i < 10; i+=2) {
        await server.publish(xName, i, route1);
        await server.publish(xName, i + 1, route2);
      }
      await (() => {
        return new Promise(resolve => setTimeout(resolve, 200));
      })();
    } catch (err) {
      assert.fail(err);
    }
  });
  describe("check values", () => {
    it('t1', async () => {
      assert.equal(_t1, t1);
    });
    it('t2', async () => {
      assert.equal(_t2, t2);
    });
    it('t1x', async () => {
      assert.equal(_t1x, t1x);
    });
  });
  it('unsubscribe', async () => {
    try {
      await server.unsubscribe(xName + "_1", xName, pattern1);
      await server.unsubscribe(xName + "_2", xName, pattern2);
    } catch (err) {
      assert.fail(err);
    }
  });
  it('delete exchange queues', async () => {
    try {
      await server.deleteQueue(xName + "_1");
      await server.deleteQueue(xName + "_2");
    } catch (err) {
      assert.fail(err);
    }
  });
  it('delete exchange', async () => {
    try {
      await server.deleteExchange(xName);
    } catch (err) {
      assert.fail(err);
    }
  });
}

describe('publish/subscribe', () => {
  describe('fanout - no filter -', () => {
    aux(exchange1, "fanout", "", "", "", "", 10, 45, 11);
  });
  describe('direct - exact filter -', () => {
    aux(exchange2, "direct", "red", "blue", "red", "blue", 5, 25, 6);
  });
  describe('topic - path filter -', () => {
    aux(exchange3, "topic", "a.a", "a.*", "a.a", "a.b", 5, 45, 6);
  });
});
