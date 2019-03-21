# amqpPattern
amqp nodejs class to easily manage different kind of patterns with almost no code

logs are generated through tracer library(https://www.npmjs.com/package/tracer). Check tracer project to configurate your logs

Right now it has 3 possible patterns managed
* fifo queue pattern (https://en.wikipedia.org/wiki/FIFO_(computing_and_electronics)
* publish/subscribe pattern (https://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern)
* rpc pattern (https://en.wikipedia.org/wiki/Remote_procedure_call)

*Unit tests require to have rabbitMQ installed on local.*

## init / end connection connection
First is needed to instance the class. At oposite of main amqp class each instance will manage only one channel. It helps to avoid complexity and helps to control different logical elements in a simpler structured way.

```javascript
'use strict';

const amqpPattern = require('amqpPattern');
const logger = require('tracer').colorConsole({level:'debug'});

var x = new amqpPattern('amqp://localhost', logger);
x.init().then(async () => {
  x.dispose();
});
```

## patterns

### fifo queue pattern
A simple fifo pattern where the client send items to the queue with no need of any kind of feedback, except possible queuing failure (managed through basic exceptions). Consumer will process the work in the attached callback, requeuing any item who retrieves an exception.

#### queuing
```javascript
var x = new amqpPattern('amqp://localhost', logger);
x.init().then(async () => {
  await x.initQueue("test");
  for (var i = 0; i<100; i++)
    x.queue("test", i);
});
```

#### consume
```javascript
var x = new amqpPattern('amqp://localhost', logger);
x.init().then(async () => {
  x.consume("test", async (val) => {
    console.log(val);
  });
});
```

### publish/subscribe pattern
A pattern where each message is related to more than one possible queue, filtered through basic mechanisms to decide whose queues with keep the messages.

* The act of queuing is not called queuing anymore, it is called publish.
* The way the message is redirected to each queue is called subscription.

Each one of these queues can have his own consumer, to process the message.

#### publish
```javascript
var x = new amqpPattern('amqp://localhost', logger);
x.init().then(async () => {
  await server.initExchange("queue_1", "fanout");
  for (var i = 0; i<100; i++)
    x.publish("test", i, "");
});
```

#### subscribe
```javascript
var x = new amqpPattern('amqp://localhost', logger);
x.init().then(async () => {
  await x.initQueue("queue_1");
  await x.initQueue("queue_2");
  await x.initExchange("queue_1", "fanout");
  await x.subscribe("queue_1", "queue", "");
  await x.subscribe("queue_2", "queue", "");
});
```

### rpc pattern
An standard procedure flow through basic client/server interaction.

#### calls
```javascript
var x = new amqpPattern('amqp://localhost', logger);
x.init().then(async () => {
  console.log(await x.rpcCall("method", 1));
});
```

#### procedure
```javascript
var x = new amqpPattern('amqp://localhost', logger);
x.init().then(async () => {
  x.rpcServer("method", async (val) => {
    return val + 1;
  });
});
```
