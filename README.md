# rabbitmq-micro-service-framework

This is a nodejs micro service framework using rabbitmq as message broker.

### Install Package

```sh
npm i rabbitmq-micro-service-framework
```

### Tutorial

The package will use environment variable `RABBITMQ_URL` to connect to rabbitmq, if not provided the default value `localhost:5672` will be used. 

* To setup a service

```js
const { createService } = require('rabbitmq-micro-service-framework')

const service = createService('serviceName');
```

* To add an rpc request handler

```js
service.registerRpcHandler("sum", (a, b, c, d) => {
    return a + b + c + d;
})
```

or 

```js
service.registerRpcHandler("multply", (a, b) => {
    return a * b;
})

```


* To consume the rpc request

```js
const sum = await rpcRequest("serviceName", "sum", 1, 2, 3, 4)
```

or

```js
const multiply = await rpcRequest("serviceName", "multiply", 120, 2)
```


#### Example

An example is available in the examples folder.

Make sure you have a running rabbitmq server and the `RABBITMQ_URL` env is set before running the example.

To run the example

run `node examples/client.js` in one terminal

run `node services/sample-service/index.js` in another terminal

and check `http://localhost:8081/rpc` for the result.


