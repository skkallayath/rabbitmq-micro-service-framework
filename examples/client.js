const express = require("express");
const { rpcRequest } = require('../dist')
const app = express();
const port = 8081; // default port to listen



// define a route handler for the default home page
app.get("/", (req, res) => {
    res.send("Client App running!");
});

app.get("/rpc", async (req, res) => {
    const sum = await rpcRequest("sample-service", "sum", 1, 2, 3, 4)
    const multiply = await rpcRequest("sample-service", "multiply", 120, 2)
    res.send({ sum, multiply });
});

// start the Express server
app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`);
});