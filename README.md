# rabbitmq-micro-service-framework

This is a nodejs micro service framework using rabbitmq as message broker.

### Install Package

```sh
npm i rabbitmq-micro-service-framework
```

### Tutorial

The package will use environment variable `RABBITMQ_URL` to connect to rabbitmq, if not provided the default value `localhost:5672` will be used.

- To setup a service

```js
const { createService } = require("rabbitmq-micro-service-framework");

const service = await createService("serviceName");
```

- To add an rpc request handler

```js
service.registerRpcHandler("sum", (a, b, c, d) => {
  return a + b + c + d;
});
```

or

```js
service.registerRpcHandler("multply", (a, b) => {
  return a * b;
});
```

- To consume the rpc request

```js
const { rpcRequest } = require("rabbitmq-micro-service-framework");

const sum = await rpcRequest("serviceName", "sum", 1, 2, 3, 4);
```

or

```js
const { rpcRequest } = require("rabbitmq-micro-service-framework");

const multiply = await rpcRequest("serviceName", "multiply", 120, 2);
```

#### Example

Make sure you have a running rabbitmq server and the `RABBITMQ_URL` env is set before running the example.

- create a service file `service.js`

```js
// service.js
const { createService } = require("rabbitmq-micro-service-framework");

createService("sample-service").then((service) => {
  service.registerRpcHandler("sum", (a, b, c, d) => {
    return a + b + c + d;
  });
  service.registerRpcHandler("multiply", (a, b) => {
    return a * b;
  });
});
```

- create a service file `client.js`

```js
//client.js
const express = require("express");
const { rpcRequest } = require("rabbitmq-micro-service-framework");
const app = express();
const port = 8081;

app.get("/rpc", async (req, res) => {
  const sum = await rpcRequest("sample-service", "sum", 1, 2, 3, 4);
  const multiply = await rpcRequest("sample-service", "multiply", 120, 2);
  res.send({ sum, multiply });
});

// start the Express server
app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});
```

- install `express` and `rabbitmq-micro-service-framework`

```sh
npm i express rabbitmq-micro-service-framework
```

To run the example

run `node service.js` in one terminal

run `node client.js` in another terminal

and check `http://localhost:8081/rpc` for the result.
