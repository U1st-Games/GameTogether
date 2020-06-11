/*
GameTogether © Copyright, Nang Development Limited 2020. All Rights Reserved.

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import * as SocketIO from "socket.io";
import {Room, Socket} from "socket.io";

import {store} from "./State/state";
import {
    addHostToRoomAction,
    addRoomWithHostSocketIdAction, removeHostFromRoomAction,
} from "./State/actions";
import {isHost} from "./State/selectors";
import {ByeMessage} from "../src/types";

const os = require("os");

const getRoom = (io: SocketIO.Server, roomId: string): Room => io.sockets.adapter.rooms[roomId];

const sendToRoomSansSender = (socket: Socket, event: string, roomId: string, data?: any) => {
    console.log('sendToRoomSansSender: ', event);
    socket.to(roomId).emit(event, data);
};

const clientsInRoomCount = (io: SocketIO.Server, roomId: string): number => {
    const room = getRoom(io, roomId);
    return room
        ? Object.keys(room.sockets).length
        : 0;
};

const createRoom = (socket: Socket, roomId: string) => {
    socket.join(roomId);
    console.log("Client ID " + socket.id + " created roomId " + roomId);
    socket.emit("created", roomId, socket.id);
    store.dispatch(addRoomWithHostSocketIdAction(roomId, socket.id));
    store.dispatch(addHostToRoomAction(roomId, socket.id))
};

const joinRoom = (socket: Socket, roomId: string) => {
    console.log("Client ID " + socket.id + " joined roomId " + roomId);
    sendToRoomSansSender(socket,'join', roomId, roomId);
    socket.join(roomId);
    socket.emit("joined", roomId, socket.id);
};

const signalingServer = (io: SocketIO.Server) => {
    io.sockets.on("connection", function(socket) {
        console.log("connection");

        socket.on("gotUserMedia", function(roomId) {
            sendToRoomSansSender(socket, 'gotUserMedia', roomId, roomId);
        });

        socket.on("offer", function(roomId, message) {
            sendToRoomSansSender(socket, 'offer', roomId, message);
        });

        socket.on("answer", function(roomId, message) {
            sendToRoomSansSender(socket, 'answer', roomId, message);
        });

        socket.on("message", function(roomId, message) {
            //console.log('message: ', message);
            sendToRoomSansSender(socket, 'message', roomId, message);
        });

        socket.on("create or join", function(roomId) {
            console.log("Received request to create or join room " + roomId);
            const numClients = clientsInRoomCount(io, roomId);
            console.log("Room " + roomId + " now has " + numClients + " client(s)");

            if (numClients === 0) {
                createRoom(socket, roomId);
            } else {
                joinRoom(socket, roomId);
            }
        });

        socket.on("ipaddr", function() {
            console.log('ipaddr called');
        });

        socket.on("bye", function(roomId, message: ByeMessage) {
            if(isHost(socket.id)) {
                store.dispatch(removeHostFromRoomAction(message.roomId));
                //handleHostLeaving();
                sendToRoomSansSender(socket, 'bye', roomId);
                io.of('/').in(roomId).clients((error: any, socketIds: any) => {
                    if (error) throw error;
                    socketIds.forEach((socketId: string) => io.sockets.sockets[socketId].leave(roomId));
                });
            }
        });

        socket.on('disconnect', (roomId) => {
            console.log('disconnect: ', roomId)
        });
    });
};

export default signalingServer;
