'use strict';

const assert = require('chai').assert;
const amqp_pattern = require('../index');
const logger = require('tracer').colorConsole({level:'debug'});

describe('init', () => {
  describe('class with logs', () => {
    var server;

    it('create class', async () => {
      try {
        server = new amqp_pattern('amqp://localhost', logger);
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
        server = new amqp_pattern('amqp://localhost');
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
