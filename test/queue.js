/*'use strict';

const assert = require('chai').assert;
const amqpPattern = require('../index');

var test;

const queue1 = "queue1";
const queue2 = "queue2";
const queue3 = "queue3";
const queue4 = "queue4";

function aux(qName, durable, lifeTime, maxItems) {
  var server;

  before(async () => {
    server = new amqpPattern('amqp://localhost');
    await server.init();
  });
  after(async () => {
    await (() => {
      return new Promise(resolve => setTimeout(resolve, 300));
    })();
    server.dispose();
  });
  it('create queue', async () => {
    try {
      await server.initQueue(qName, durable, lifeTime, maxItems);
    } catch (err) {
      assert.fail(err);
    }
  });
  it('queue 10 items', async () => {
    try {
      for (var i = 0; i < 10; i++)
        await server.queue(qName, {
          "id": i,
          "text": "testQueue " + i
        });
    } catch (err) {
      assert.fail(err);
    }
  });
  it('consume items', async () => {
    try {
      var firstAttempt = false;
      var total = 0;
      var mItems = 10 + 1;
      if (maxItems == 5)
        mItems = maxItems;

      if (lifeTime != null) {
        await (() => {
          return new Promise(resolve => setTimeout(resolve, lifeTime * 1000 + 100));
        })();
        mItems = 0;
      }

      server.consume(qName, async (val) => {
        total++;
        if (val.id == 1 && !firstAttempt) {
          firstAttempt = true;
          throw "not valid val";
        }
      });

      await (() => {
        return new Promise(resolve => setTimeout(resolve, 300));
      })();


      assert.equal(total, mItems, "total calls not match");
    } catch (err) {
      assert.fail(err);
    }
  });
  it('delete queue', async () => {
    try {
      await server.deleteQueue(qName);
    } catch (err) {
      assert.fail(err);
    }
  });
}

describe('queue', () => {
  describe('standard queue', () => {
    aux(queue1);
  });
  describe('1 second lifetime items queue', () => {
    aux(queue2, true, 1);
  });

  describe('max 5 items queue', () => {
    aux(queue3, true, null, 5);
  });
  describe('1 second lifetime items queue', () => {
    aux(queue4, false);
  });
});
*/
