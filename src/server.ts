import * as express from 'express';
import path from 'path';

const os = require("os");
const http = require('http');
const socketIO = require("socket.io");

const app = express.default();
var server = http.createServer(app);
const io = socketIO.listen(server);

const port = process.env.PORT || 8080;
server.listen(port);

app.use(express.static(path.join(__dirname, '../build')));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
});
console.log('Server started on port:', port);

//@ts-ignore
io.sockets.on("connection", function(socket) {
    console.log("connection");

    //@ts-ignore
    socket.on("gotUserMedia", function(room) {
        console.log("gotUsermedia");
        io.to(room).emit('gotUserMedia', room);
    });

    //@ts-ignore
    socket.on("offer", function(message, roomid) {
        console.log("offer: ", message);
        io.to(roomid).emit('offer', message);
    });

    //@ts-ignore
    socket.on("answer", function(message, roomid) {
        console.log("answer");
        io.to(roomid).emit('answer', message);
    });

    //@ts-ignore
    socket.on("message", function(message, roomid) {
        console.log("Client said: ", message);
        io.to(roomid).emit('message', message);
    });

    //@ts-ignore
    socket.on("create or join", function(room) {
        console.log("Received request to create or join room " + room);

        var clientsInRoom = io.sockets.adapter.rooms[room];
        var numClients = clientsInRoom
            ? Object.keys(clientsInRoom.sockets).length
            : 0;

        console.log("Room " + room + " now has " + numClients + " client(s)");

        if (numClients === 0) {
            socket.join(room);
            console.log("Client ID " + socket.id + " created room " + room);
            socket.emit("created", room, socket.id);
        } else {
            console.log("Client ID " + socket.id + " joined room " + room);
            io.to(room).emit('join', room);
            socket.join(room);
            socket.emit("joined", room, socket.id);
        }
    });

    socket.on("ipaddr", function() {
        //@ts-ignore
        var ifaces = os.networkInterfaces();
        for (var dev in ifaces) {
            //@ts-ignore
            ifaces[dev].forEach(function(details) {
                if (details.family === "IPv4" && details.address !== "127.0.0.1") {
                    socket.emit("ipaddr", details.address);
                }
            });
        }
    });

    socket.on("bye", function() {
        console.log("received bye");
    });
});

