import * as express from "express";

const http = require('http');
const socketIO = require("socket.io");

const initServer = () => {
    const app = express.default();
    var server = http.createServer(app);
    const io = socketIO.listen(server);
    const port = process.env.PORT || 8080;
    server.listen(port);
    console.log('Server started on port:', port);

    return ({ io, app });
};

export default initServer;
