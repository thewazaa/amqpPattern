<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

### Table of Contents

-   [index][1]
    -   [Parameters][2]
    -   [dispose][3]
    -   [log][4]
        -   [Parameters][5]
    -   [init][6]
    -   [deleteQueue][7]
        -   [Parameters][8]
    -   [queue][9]
        -   [Parameters][10]
    -   [initExchange][11]
        -   [Parameters][12]
    -   [deleteExchange][13]
        -   [Parameters][14]
    -   [publish][15]
        -   [Parameters][16]
    -   [subscribe][17]
        -   [Parameters][18]
    -   [unsubscribe][19]
        -   [Parameters][20]
    -   [initQueue][21]
        -   [Parameters][22]
    -   [consume][23]
        -   [Parameters][24]
    -   [rpcServer][25]
        -   [Parameters][26]
    -   [rpcStrategy][27]
        -   [Parameters][28]
    -   [rpcCall][29]
        -   [Parameters][30]

## index

amqp_pattern class:
Basic class who provides client/server methods to comunicate with a rabbitMQ
queue.

### Parameters

-   `serverURI` **[string][31]** URI to connect to an AMQP server
-   `logger` **tracer** Log generator

### dispose

dispose - destroy object

### log

log - Auxiliar method for logging. All class logs will have an unique uuid

#### Parameters

-   `level` **eLogLevel** log level
-   `msg` **type** text message
-   `params` **type** = null Parameters related to the log (optional, default `null`)

### init

async init - Initializates the connection with the AMQP server

Returns **[Promise][32]** Connection promise to manage the connection after it
                   has been completely initializated

### deleteQueue

async deleteQueue - removes a queue

#### Parameters

-   `qName` **[string][31]** queue name

### queue

async queue - queue items to an already created queue

#### Parameters

-   `qName` **[string][31]** queue name
-   `msg` **[object][33]** the object message to queue

### initExchange

async initQueue - initialize an exchange / creates it

#### Parameters

-   `xName` **[string][31]** exchange name
-   `type` **[string][31]** = 'fanout'    exchange type (optional, default `'fanout'`)
-   `durable` **!bool** = true     exchange is maintaned when server
                                        restarts (optional, default `true`)
-   `autoDelete` **!bool** = false exchange is deleted when bindings
                                        become 0 (optional, default `false`)

### deleteExchange

async deleteExchange - removes an exchange

#### Parameters

-   `xName` **[string][31]** exchange name

### publish

async publish - publish items to an already created exchange

#### Parameters

-   `xName` **[string][31]** exchange name
-   `msg` **[object][33]** the object message to queue
-   `routeKey` **[object][33]** = "" route rule to reach the exchange (optional, default `""`)

### subscribe

async subscribe - subsribe to an exchange

#### Parameters

-   `qName` **[string][31]** queue name
-   `xName` **[string][31]** exchange name
-   `pattern` **[object][33]** = "" pattern to distribute to queues (optional, default `""`)

### unsubscribe

async unsubscribe - unsubsribe to an exchange

#### Parameters

-   `qName` **[string][31]** queue name
-   `xName` **[string][31]** exchange name
-   `pattern` **[object][33]** = "" pattern to distribute to queues (optional, default `""`)

### initQueue

async initQueue - initialize a queue / creates it

#### Parameters

-   `qName` **[string][31]** queue name
-   `durable` **!bool** = true     queue is maintaned when server restarts (optional, default `true`)
-   `lifeTime` **!int** = null    queue items timeout in seconds (optional, default `null`)
-   `maxQueue` **!int** = null    max items we can have in the queue (optional, default `null`)
-   `autoDelete` **!bool** = false queue is deleted when bindings become 0 (optional, default `false`)

### consume

async consume - attach a queue to a callback method
                in case of exception, the item is requeud

#### Parameters

-   `qName` **type** queue name
-   `cb` **type** callback method

### rpcServer

async rpcServer - initializate an RPC method through AMQP

#### Parameters

-   `qName` **[string][31]** function name
-   `cb` **[function][34]** function itself.
                             It has to retrieve back some value.
                             It need to be defined as asynchronous

### rpcStrategy

async rpcStrategy - initialize an RPC set of methods who follow strategy
                    pattern through AMQP

#### Parameters

-   `xName` **type** function name
-   `cbStrategyChooser` **type** callback for the strategy chooser.
                                     it has to retrieve back a selected
                                     strategy to run
-   `cbStrategies` **type** named array of callbacks. Each name is
                                     an strategy and each function a possible
                                     strategy to run

### rpcCall

async rpcCall - perform a RPC call through AMQP

#### Parameters

-   `qName` **[string][31]** Function name
-   `pars` **[object][33]** Paraemters to be delivered
-   `timeout` **numeric** Max time to wait for response (optional, default `10`)

Returns **[object][33]** Response from the call

[1]: #index

[2]: #parameters

[3]: #dispose

[4]: #log

[5]: #parameters-1

[6]: #init

[7]: #deletequeue

[8]: #parameters-2

[9]: #queue

[10]: #parameters-3

[11]: #initexchange

[12]: #parameters-4

[13]: #deleteexchange

[14]: #parameters-5

[15]: #publish

[16]: #parameters-6

[17]: #subscribe

[18]: #parameters-7

[19]: #unsubscribe

[20]: #parameters-8

[21]: #initqueue

[22]: #parameters-9

[23]: #consume

[24]: #parameters-10

[25]: #rpcserver

[26]: #parameters-11

[27]: #rpcstrategy

[28]: #parameters-12

[29]: #rpccall

[30]: #parameters-13

[31]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String

[32]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise

[33]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object

[34]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function
