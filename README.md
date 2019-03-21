<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

### Table of Contents

-   [index][1]
    -   [dispose][2]
    -   [log][3]
        -   [Parameters][4]
    -   [init][5]
    -   [deleteQueue][6]
        -   [Parameters][7]
    -   [queue][8]
        -   [Parameters][9]
    -   [initExchange][10]
        -   [Parameters][11]
    -   [deleteExchange][12]
        -   [Parameters][13]
    -   [publish][14]
        -   [Parameters][15]
    -   [subscribe][16]
        -   [Parameters][17]
    -   [unsubscribe][18]
        -   [Parameters][19]
    -   [initQueue][20]
        -   [Parameters][21]
    -   [initQueue][22]
        -   [Parameters][23]
    -   [rpcServer][24]
        -   [Parameters][25]
    -   [rpcCall][26]
        -   [Parameters][27]

## index

amqpPattern class:
Basic class who provides client/server methods to comunicate with a rabbitMQ
queue.

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

Returns **[Promise][28]** Connection promise to manage the connection after it
                   has been completely initializated

### deleteQueue

async deleteQueue - removes a queue

#### Parameters

-   `qName` **[string][29]** queue name

### queue

async queue - queue items to an already created queue

#### Parameters

-   `qName` **[string][29]** queue name
-   `msg` **[object][30]** the object message to queue

### initExchange

async initQueue - initialize an exchange / creates it

#### Parameters

-   `xName` **[string][29]** exchange name
-   `type` **[string][29]** = 'fanout' exchange type (optional, default `'fanout'`)
-   `durable` **!bool** = true  exchange is maintaned when server restarts (optional, default `true`)

### deleteExchange

async deleteExchange - removes an exchange

#### Parameters

-   `xName` **[string][29]** exchange name

### publish

async publish - publish items to an already created exchange

#### Parameters

-   `xName` **[string][29]** exchange name
-   `msg` **[object][30]** the object message to queue
-   `routeKey` **[object][30]** = "" route rule to reach the exchange (optional, default `""`)

### subscribe

async subscribe - subsribe to an exchange

#### Parameters

-   `qName` **[string][29]** queue name
-   `xName` **[string][29]** exchange name
-   `pattern` **[object][30]** = "" pattern to distribute to queues (optional, default `""`)

### unsubscribe

async unsubscribe - unsubsribe to an exchange

#### Parameters

-   `qName` **[string][29]** queue name
-   `xName` **[string][29]** exchange name
-   `pattern` **[object][30]** = "" pattern to distribute to queues (optional, default `""`)

### initQueue

async consume - attach a queue to a callback method
                in case of exception, the item is requeud

#### Parameters

-   `qName` **type** queue name
-   `durable`   (optional, default `true`)
-   `lifeTime`   (optional, default `null`)
-   `maxQueue`   (optional, default `null`)
-   `cb` **type** callback method

### initQueue

async initQueue - initialize a queue / creates it

#### Parameters

-   `qName` **[string][29]** queue name
-   `durable` **!bool** = true  queue is maintaned when server restarts (optional, default `true`)
-   `lifeTime` **!int** = null queue items timeout in seconds (optional, default `null`)
-   `maxQueue` **!int** = null max items we can have in the queue (optional, default `null`)

### rpcServer

async rpcServer - initializate and RPC method through AMQP

#### Parameters

-   `qName` **[string][29]** function name
-   `cb` **[function][31]** function itself.
                             It has to retrieve back some value.
                             It need to be defined as asynchronous

### rpcCall

async rpcCall - perform a RPC call through AMQP

#### Parameters

-   `qName` **[string][29]** Function name
-   `pars` **[object][30]** Paraemters to be delivered
-   `timeout` **numeric** Max time to wait for response (optional, default `10`)

Returns **[object][30]** Response from the call

[1]: #index

[2]: #dispose

[3]: #log

[4]: #parameters

[5]: #init

[6]: #deletequeue

[7]: #parameters-1

[8]: #queue

[9]: #parameters-2

[10]: #initexchange

[11]: #parameters-3

[12]: #deleteexchange

[13]: #parameters-4

[14]: #publish

[15]: #parameters-5

[16]: #subscribe

[17]: #parameters-6

[18]: #unsubscribe

[19]: #parameters-7

[20]: #initqueue

[21]: #parameters-8

[22]: #initqueue-1

[23]: #parameters-9

[24]: #rpcserver

[25]: #parameters-10

[26]: #rpccall

[27]: #parameters-11

[28]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise

[29]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String

[30]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object

[31]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function
