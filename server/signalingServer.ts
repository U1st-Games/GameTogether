import {Socket} from "socket.io";
import {store} from "./State/state";
import {addRoomAction} from "./State/actions";
import * as SocketIO from "socket.io";
const os = require("os");

const sendToRoomSansSender = (io: any, event: string, roomId: string, data?: any) => {
    console.log(event);
    io.to(roomId).emit(event, data);
}

const signalingServer = (io: SocketIO.Server) => {
    io.sockets.on("connection", function(socket) {
        console.log("connection");

        socket.on("gotUserMedia", function(roomId) {
            sendToRoomSansSender(io, 'gotUserMedia', roomId, roomId);
        });

        socket.on("offer", function(roomId, message) {
            sendToRoomSansSender(io, 'offer', roomId, message);
        });

        socket.on("answer", function(roomId, message) {
            sendToRoomSansSender(io, 'answer', roomId, message);
        });

        socket.on("message", function(roomId, message) {
            sendToRoomSansSender(io, 'message', roomId, message);
        });

        socket.on("create or join", function(room) {
            console.log("Received request to create or join room " + room);

            //@ts-ignore
            var clientsInRoom = io.sockets.adapter.rooms[room];
            var numClients = clientsInRoom
                ? Object.keys(clientsInRoom.sockets).length
                : 0;

            console.log("Room " + room + " now has " + numClients + " client(s)");

            if (numClients === 0) {
                socket.join(room);
                console.log("Client ID " + socket.id + " created room " + room);
                socket.emit("created", room, socket.id);

                //store.dispatch(addRoomAction(room, ___));
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
};

export default signalingServer;
