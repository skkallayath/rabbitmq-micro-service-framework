const express = require("express");
const { createService } = require('../../../dist')
const app = express();
const port = 8080; // default port to listen

createService("sample-service").then(service => {
    service.registerRpcHandler("sum", (a, b, c, d) => {
        return a + b + c + d;
    });
    service.registerRpcHandler("multiply", (a, b) => {
        return a * b;
    });
});


// define a route handler for the default home page
app.get("/", (req, res) => {
    res.send("Hello world!");
});

// start the Express server
app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`);
});