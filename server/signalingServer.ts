import {Socket} from "socket.io";
import {store} from "./State/state";
import {addRoomAction} from "./State/actions";
import * as SocketIO from "socket.io";
const os = require("os");

const sendToRoomSansSender = (io: SocketIO.Server, event: string, roomId: string, data?: any) => {
    console.log(event);
    io.to(roomId).emit(event, data);
};

const clientsInRoomCount = (io: SocketIO.Server, roomId: string): number => {
    var clientsInRoom = io.sockets.adapter.rooms[roomId];
    return clientsInRoom
        ? Object.keys(clientsInRoom.sockets).length
        : 0;
};

const createRoom = (socket: Socket, roomId: string) => {
    socket.join(roomId);
    console.log("Client ID " + socket.id + " created roomId " + roomId);
    socket.emit("created", roomId, socket.id);
    //store.dispatch(addRoomAction(roomId, ___));
};

const joinRoom = (io: SocketIO.Server, socket: Socket, roomId: string) => {
    console.log("Client ID " + socket.id + " joined roomId " + roomId);
    sendToRoomSansSender(io,'join', roomId, roomId);
    socket.join(roomId);
    socket.emit("joined", roomId, socket.id);
};

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

        socket.on("create or join", function(roomId) {
            console.log("Received request to create or join room " + roomId);
            const numClients = clientsInRoomCount(io, roomId);
            console.log("Room " + roomId + " now has " + numClients + " client(s)");

            if (numClients === 0) {
                createRoom(socket, roomId);
            } else {
                joinRoom(io, socket, roomId);
            }
        });

        socket.on("ipaddr", function() {
            console.log('ipaddr called');
        });

        socket.on("bye", function() {
            console.log("received bye");
        });
    });
};

export default signalingServer;
