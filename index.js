'use strict';

const amqp = require('amqplib/callback_api');
const uuidv1 = require('uuid/v1');

/**
 * amqp_pattern class:
 * Basic class who provides client/server methods to comunicate with a rabbitMQ
 * queue.
 *
 * @param  {string}   serverURI URI to connect to an AMQP server
 * @param  {tracer}   logger    Log generator
 */
module.exports = class {

  constructor(serverURI, logger) {
    this.eLogLevel = Object.freeze({
      "trace": 1,
      "debug": 2,
      "warning": 3,
      "info": 4,
      "error": 5,
      "fatal": 6
    });

    this.uuid = uuidv1();
    this.logger = logger;
    this.serverURI = serverURI;
    this.log(this.eLogLevel.debug, "rabbitAPI class created", this.serverURI);
  }

  /**
   * dispose - destroy object
   */
  dispose() {
    if (this.conn != null) {
      this.conn.close();
      this.log(this.eLogLevel.trace, "connection closed");
    }
    this.conn = null;
    this.log(this.eLogLevel.debug, "rabbitAPI class disposed");
  }

  /**
   * log - Auxiliar method for logging. All class logs will have an unique uuid
   *
   * @param  {eLogLevel} level    log level
   * @param  {type} msg           text message
   * @param  {type} params = null Parameters related to the log
   */
  log(level, msg, params = null) {
    if (this.logger == null)
      return;
    var info = {
      "uuid": this.uuid,
      "msg": msg
    };
    if (params != null)
      info["params"] = params;
    switch (level) {
      case this.eLogLevel.trace:
        this.logger.trace(info);
        break;
      case this.eLogLevel.debug:
        this.logger.debug(info);
        break;
      case this.eLogLevel.waring:
        this.logger.waring(info);
        break;
      case this.eLogLevel.info:
        this.logger.info(info);
        break;
      case this.eLogLevel.error:
      case this.eLogLevel.fatal:
        info["trace"] = new Error();
        this.logger.error(info);
        break;
    }
  }

  /**
   * async init - Initializates the connection with the AMQP server
   *
   * @return {Promise}  Connection promise to manage the connection after it
   *                    has been completely initializated
   */
  async init() {
    this.log(this.eLogLevel.trace, "init start");
    try {
      var it = this;

      return await new Promise((resolve, reject) => {
        amqp.connect(this.serverURI, (err, conn) => {
          if (err != null) {
            reject(err);
          } else {
            this.log(this.eLogLevel.trace, "init: connection opened");
            it.conn = conn;

            it.conn.createChannel((err, ch) => {
              if (err != null) {
                reject(err);
              } else {
                this.log(this.eLogLevel.trace, "init: channel created");
                it.ch = ch;

                resolve("Connected");
              }
            });
          }
        });
      });
    } catch (err) {
      this.log(this.eLogLevel.error, "init failure", err);
      throw err;
    } finally {
      this.log(this.eLogLevel.debug, "init performed");
    }
  }

  // region: queue pattern

  /**
   * async deleteQueue - removes a queue
   *
   * @param  {string} qName queue name
   */
  async deleteQueue(qName) {
    this.log(this.eLogLevel.trace, "deleteQueue start", [qName]);
    try {
      this.ch.deleteQueue(qName);
    } catch (err) {
      this.log(this.eLogLevel.error, "deleteQueue failure", [qName, err]);
      throw err;
    } finally {
      this.log(this.eLogLevel.debug, "deleteQueue performed", [qName]);
    }
  }

  /**
   * async queue - queue items to an already created queue
   *
   * @param  {string} qName queue name
   * @param  {object} msg   the object message to queue
   */
  async queue(qName, msg) {
    this.log(this.eLogLevel.trace, "queue start", [qName, msg]);
    try {
      this.ch.sendToQueue(qName,
        Buffer.from(JSON.stringify(msg)), {
          content_type: "application/json"
        });
    } catch (err) {
      this.log(this.eLogLevel.error, "queue failure", [qName, msg, err]);
      throw err;
    } finally {
      this.log(this.eLogLevel.debug, "queue filled", [qName, msg]);
    }
  }

  // end region: queue pattern

  // region: publish/subscribe pattern

  /**
   * async initQueue - initialize an exchange / creates it
   *
   * @param  {string} xName           exchange name
   * @param  {string} type = 'fanout' exchange type
   * @param  {!bool}  durable = true  exchange is maintaned when server restarts
   */
  async initExchange(xName, type = 'fanout', durable = true) {
    this.log(this.eLogLevel.trace, "initExchange start", [xName, type,
      durable]);
    try {
      var parameters = {
        durable: durable
      };

      this.ch.assertExchange(xName, type, parameters);
    } catch (err) {
      this.log(this.eLogLevel.error, "initExchange failure", [xName, type,
        durable, err]);
      throw err;
    } finally {
      this.log(this.eLogLevel.debug, "initExchange performed", [xName, type,
        durable]);
    }
  }

  /**
   * async deleteExchange - removes an exchange
   *
   * @param  {string} xName exchange name
   */
  async deleteExchange(xName) {
    this.log(this.eLogLevel.trace, "deleteExchange start", [xName]);
    try {
      this.ch.deleteExchange(xName);
    } catch (err) {
      this.log(this.eLogLevel.error, "deleteExchange failure", [xName, err]);
      throw err;
    } finally {
      this.log(this.eLogLevel.debug, "deleteExchange performed", [xName]);
    }
  }

  /**
   * async publish - publish items to an already created exchange
   *
   * @param  {string} xName         exchange name
   * @param  {object} msg           the object message to queue
   * @param  {object} routeKey = "" route rule to reach the exchange
   */
  async publish(xName, msg, routeKey = "") {
    this.log(this.eLogLevel.trace, "publish start", [xName, msg]);
    try {
      this.ch.publish(xName, routeKey,
        Buffer.from(JSON.stringify(msg)), {
          content_type: "application/json"
        });
    } catch (err) {
      this.log(this.eLogLevel.error, "publish failure", [xName, msg, err]);
      throw err;
    } finally {
      this.log(this.eLogLevel.debug, "publish filled", [xName, msg]);
    }
  }

  /**
   * async subscribe - subsribe to an exchange
   *
   * @param  {string} qName        queue name
   * @param  {string} xName        exchange name
   * @param  {object} pattern = "" pattern to distribute to queues
   */
  async subscribe(qName, xName, pattern = "") {
    this.log(this.eLogLevel.trace, "subscribe start", [qName, xName, pattern]);
    try {
      this.ch.bindQueue(qName, xName, pattern);
    } catch (err) {
      this.log(this.eLogLevel.error, "subscribe failure", [qName, xName,
        pattern, err]);
      throw err;
    } finally {
      this.log(this.eLogLevel.debug, "subscribe performed", [qName, xName,
      pattern]);
    }
  }

  /**
   * async unsubscribe - unsubsribe to an exchange
   *
   * @param  {string} qName        queue name
   * @param  {string} xName        exchange name
   * @param  {object} pattern = "" pattern to distribute to queues
   */
  async unsubscribe(qName, xName, pattern = "") {
    this.log(this.eLogLevel.trace, "unsubscribe start", [qName, xName,
      pattern]);
    try {
      this.ch.unbindQueue(qName, xName, pattern);
    } catch (err) {
      this.log(this.eLogLevel.error, "unsubscribe failure", [qName, xName,
        pattern, err]);
      throw err;
    } finally {
      this.log(this.eLogLevel.debug, "unsubscribe performed", [qName, xName,
      pattern]);
    }
  }

  // end region: publish/subscribe pattern

  // region: mixed queue and publish/subscribe pattern

  /**
  * async initQueue - initialize a queue / creates it
  *
  * @param  {string} qName           queue name
  * @param  {!bool}  durable = true  queue is maintaned when server restarts
  * @param  {!int}   lifeTime = null queue items timeout in seconds
  * @param  {!int}   maxQueue = null max items we can have in the queue
  */
  async initQueue(qName, durable = true, lifeTime = null, maxQueue = null) {
   this.log(this.eLogLevel.trace, "initQueue start", [qName, durable,
     lifeTime, maxQueue]);
   try {
     var parameters = {
       durable: durable
     };
     if (lifeTime != null)
       parameters["messageTtl"] = lifeTime * 1000;
     if (maxQueue != null)
       parameters["maxLength"] = maxQueue;

     this.ch.assertQueue(qName, parameters);
   } catch (err) {
     this.log(this.eLogLevel.error, "initQueue failure", [qName, durable,
       lifeTime, maxQueue, err]);
     throw err;
   } finally {
     this.log(this.eLogLevel.debug, "initQueue performed", [qName, durable,
     lifeTime, maxQueue]);
   }
  }

 /**
  * async consume - attach a queue to a callback method
  *                 in case of exception, the item is requeud
  *
  * @param  {type} qName queue name
  * @param  {type} cb    callback method
  */
  async consume(qName, cb) {
    this.log(this.eLogLevel.trace, "consume start", [qName, cb]);
    try {
      var it = this;
      this.ch.consume(qName, async (msg) => {
        if (msg == null)
          return;
        this.log(this.eLogLevel.trace, "consume method start", [qName, msg]);
        try {
          await cb(JSON.parse(msg.content));
          it.ch.ack(msg);
        } catch (error) {
          this.log(this.eLogLevel.error, "consume method failure",
            [qName, msg, error]);
          it.ch.nack(msg);
        } finally {
          this.log(this.eLogLevel.info, "consume method called",
            [qName, JSON.parse(msg.content)]);
        }
      }, {
        //consumerTag: qName
      });

    } catch (err) {
      this.log(this.eLogLevel.error, "consume failure", [qName, cb, err]);
      throw err;
    } finally {
      this.log(this.eLogLevel.debug, "consume filled", [qName, cb]);
    }
  }

  // end region: mixed queue and publish/subscribe pattern

  // region: rpc pattern

  /**
   * async rpcServer - initializate and RPC method through AMQP
   *
   * @param  {string}   qName function name
   * @param  {function} cb    function itself.
   *                          It has to retrieve back some value.
   *                          It need to be defined as asynchronous
   */
  async rpcServer(qName, cb) {
    this.log(this.eLogLevel.trace, "rpcServer start", [qName, cb]);
    try {
      var it = this;

      this.ch.assertQueue(qName, {
        durable: false,
        autoDelete: true
      });
      this.ch.consume(qName, async (msg) => {
        this.log(this.eLogLevel.trace, "rpc method start", [qName, msg]);

        var r, err = null;
        try {
          try {
            this.log(this.eLogLevel.trace, "rpc method callback start",
              [qName, msg]);
            r = await cb(JSON.parse(msg.content));
          } catch (error) {
            this.log(this.eLogLevel.warning, "rpc method callback failure",
              [qName, msg, error]);
            err = error;
          }
          it.ch.sendToQueue(msg.properties.replyTo,
            Buffer.from(JSON.stringify({
              "msg": r,
              "error": err
            })), {
              correlationId: msg.properties.correlationId,
              content_type: "application/json"
            });
          it.ch.ack(msg);
        } catch (error) {
          this.log(this.eLogLevel.error, "rpc method failure",
            [qName, msg, error]);
          throw error;
        } finally {
          this.log(this.eLogLevel.info, "rpc method called",
            [qName, JSON.parse(msg.content), r, err]);
        }
      });
    } catch (err) {
      this.log(this.eLogLevel.error, "rpcServer failure", [qName, cb, err]);
      throw err;
    } finally {
      this.log(this.eLogLevel.debug, "rpcServer created", [qName, cb]);
    }
  }

  /**
   * async rpcCall - perform a RPC call through AMQP
   *
   * @param  {string}  qName   Function name
   * @param  {object}  pars    Paraemters to be delivered
   * @param  {numeric} timeout Max time to wait for response
   * @return {object}          Response from the call
   */
  async rpcCall(qName, pars, timeout = 10) {
    var info = null;
    var done = false;

    this.log(this.eLogLevel.trace, "rpcCall start", [qName, pars]);
    try {
      var it = this;
      var waited = 0;

      return await new Promise((resolve, reject) => {
        var wait = () => {
          setTimeout(function() {
            waited += 100;
            if (!done && waited < timeout * 1000)
              wait();
            else if (!done)
              reject(qName + " timeout");
          }, 100)
        };
        wait();
        it.ch.assertQueue('', {
          exclusive: true,
          autoDelete: true
        }, (err, q) => {
          if (err != null) {
            reject(err);
          } else {
            var corr = uuidv1();

            it.ch.consume(q.queue, (msg) => {
              if (msg.properties.correlationId == corr) {
                info = JSON.parse(msg.content);
                if (info.error != null) {
                  reject(info.error);
                } else {
                  resolve(info.msg);
                }
              } else {
                reject("Security error. correlators differ %s vs %s",
                  corr, msg.properties.correlationId);
              }

            }, {
              noAck: true
            });
            it.ch.sendToQueue(qName, Buffer.from(JSON.stringify(pars)), {
              correlationId: corr,
              content_type: "application/json",
              replyTo: q.queue
            });
          }
        });
      });
    } catch (err) {
      this.log(this.eLogLevel.error, "rpcCall failure", [qName, pars, err]);
      throw err;
    } finally {
      done = true;
      this.log(this.eLogLevel.debug, "rpcCall end", [qName, pars, info]);
    }
  }

  // end region: rpc pattern

}
