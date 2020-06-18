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

import OpenTok from 'opentok';
import {Express} from "express";
import {selectRoomById} from "./State/selectors";
import store, {Room} from "./State/state";
import {addRoomWithSessionIdAction} from "./State/actions";

type SessionId = string;

interface RoomCallData {
    sessionId: string;
    token: string;
}

const apiKey = process.env.apiKey || '';
const apiSecret = process.env.apiSecret || '';

if (!apiKey || !apiSecret) {
    console.error('No opentok apiKey or apiSecret');
}

const opentok = new OpenTok(apiKey, apiSecret);


const generateToken = (sessionId: string) => opentok.generateToken(
    sessionId,
    {
        role: 'moderator',
        expireTime: (new Date().getTime() / 1000) + (24 * 60 * 60),
    }
);

const createSession = (): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
        opentok.createSession(
            {
                mediaMode: "relayed",
            },
            function(err, session) {
            if (err) reject(err);
            if (!session) {
                reject('Unable to create session');
                return;
            }
            resolve(session.sessionId);
        });
    });
};

const createRoomData = async (roomId: string): Promise<string> => {
    const sessionId = await createSession();
    store.dispatch(addRoomWithSessionIdAction(roomId, sessionId));
    return sessionId;
};

const createRoom = async (roomId: string): Promise<RoomCallData> => {
    const sessionId = await createRoomData(roomId);
    const token = generateToken(sessionId);
    return({
        sessionId,
        token,
    });
};

const getExistingRoomCallData = (room: Room): RoomCallData=> {
    const sessionId = room.sessionId;
    if (!sessionId) {
        console.error('No existing room call data');
        return { sessionId: '', token: '' };
    }
    const token = generateToken(sessionId);
    return ({
        sessionId,
        token,
    });
}

const getRoomCallData = (roomId: string): Promise<RoomCallData> => {
     return new Promise<RoomCallData>((resolve, reject) => {
         const room = selectRoomById(roomId);
         if (room) {
             resolve(getExistingRoomCallData(room));
         } else {
            resolve(createRoom(roomId));
         }
     });
};

const opentokSessionMananger = (app: Express) => {
    app.get('/opentok/roomcalldata', async function (req, res) {
        console.log('query: ', req.query);
        const roomId = req.query.roomId as string;
        if(!roomId) {
            res.status(400).send({
                message: 'roomId is required'
            });
            return;
        }
        const roomData = await getRoomCallData(roomId);
        const returnData = {...roomData, apiKey}
        res.status(200).send(returnData);
    });
};

export default opentokSessionMananger;
