# amqp_pattern
amqp nodejs class to easily manage different kind of patterns with almost no code

logs are generated through tracer library(https://www.npmjs.com/package/tracer). Check tracer project to configurate your logs

Right now it has 4 possible patterns managed
* fifo queue pattern (https://en.wikipedia.org/wiki/FIFO_(computing_and_electronics)
* publish/subscribe pattern (https://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern)
* rpc pattern (https://en.wikipedia.org/wiki/Remote_procedure_call)
* rpc with strategy pattern (https://en.wikipedia.org/wiki/Strategy_pattern)

*Unit tests require to have rabbitMQ installed on local.*

## historical of changes

* 1.0.2
  * documentation nomenclature changes to follow npm standards
  * API documentation
* 1.0.1 Corrected small unit tests issue
* 1.0.0 Initial release

## init / end connection connection
First is needed to instance the class. At oposite of main amqp class each instance will manage only one channel. It helps to avoid complexity and helps to control different logical elements in a simpler structured way.

```javascript
'use strict';

const amqp_pattern = require('amqp_pattern');
const logger = require('tracer').colorConsole({level:'debug'});

var x = new amqp_pattern('amqp://localhost', logger);
x.init().then(async () => {
  x.dispose();
});
```

## patterns

### fifo queue pattern
A simple fifo pattern where the client send items to the queue with no need of any kind of feedback, except possible queuing failure (managed through basic exceptions). Consumer will process the work in the attached callback, requeuing any item who retrieves an exception.

#### queuing
```javascript
var x = new amqp_pattern('amqp://localhost', logger);
x.init().then(async () => {
  await x.initQueue("test");
  for (var i = 0; i<100; i++)
    x.queue("test", i);
});
```

#### consume
```javascript
var x = new amqp_pattern('amqp://localhost', logger);
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
var x = new amqp_pattern('amqp://localhost', logger);
x.init().then(async () => {
  await server.initExchange("queue_1", "fanout");
  for (var i = 0; i<100; i++)
    x.publish("test", i, "");
});
```

#### subscribe
```javascript
var x = new amqp_pattern('amqp://localhost', logger);
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
var x = new amqp_pattern('amqp://localhost', logger);
x.init().then(async () => {
  console.log(await x.rpcCall("method", 1));
});
```

#### procedure
```javascript
var x = new amqp_pattern('amqp://localhost', logger);
x.init().then(async () => {
  x.rpcServer("method", async (val) => {
    return val + 1;
  });
});
```

### rpc with strategy pattern
Strategy pattern concept is to select the work to do in base an strategy chooser.
Using amqr is a cool way to implement this pattern. If we at the same time want some rpc logic, then we can create some cool features.

Call itself does not differ from rpc pattern one, so no explanation needed, here

#### calls
```javascript
var x = new amqp_pattern('amqp://localhost', logger);
x.init().then(async () => {
  console.log(await x.rpcCall("method", 1));
});
```

#### procedure
```javascript
var x = new amqp_pattern('amqp://localhost', logger);
x.init().then(async () => {
  x.rpcStrategy("method",  async (a) => {
    if (a<50)
      return "a";
    return "b";
  }, {
    "a": async (a) => { return "a " + a;  },
    "b": async (a) => { return "b " + a; }
  });
});
```
