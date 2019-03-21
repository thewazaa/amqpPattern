'use strict';

const assert = require('chai').assert;
const amqpPattern = require('../index');
const logger = require('tracer').colorConsole({level:'debug'});

var x = new amqpPattern('amqp://localhost', logger);
x.init().then(() => {
  x.consume("test", async (val) => {
    console.log(val);
  });
});

/*
describe('init', () => {
  describe('class with logs', () => {
    var server;

    it('create class', async () => {
      try {
        server = new amqpPattern('amqp://localhost', logger);
      } catch (err) {
        assert.fail(err);
      }
    });
    it('open connection', async () => {
      try {
        await server.init();
      } catch (err) {
        assert.fail(err);
      }
    });
    it('close connection', async () => {
      try {
        await server.dispose();
      } catch (err) {
        assert.fail(err);
      }
    });
  });

  describe('class with no logs', () => {
    var server;

    it('create class', async () => {
      try {
        server = new amqpPattern('amqp://localhost');
      } catch (err) {
        assert.fail(err);
      }
    });
    it('open connection', async () => {
      try {
        await server.init();
      } catch (err) {
        assert.fail(err);
      }
    });
    it('close connection', async () => {
      try {
        await server.dispose();
      } catch (err) {
        assert.fail(err);
      }
    });
  });
});
*/
