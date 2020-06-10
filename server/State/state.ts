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

import { createStore, applyMiddleware } from 'redux'
import { evolve } from 'ramda';

import {
    Action,
    AddHostToRoomAction,
    RemoveRoomAction,
    AddRoomWithHostSocketIdAction,
    AddRoomWithSessionIdAction
} from "./actions";

export interface Room {
    roomId: string;
    sessionId?: string;
    hostSocketId?: string;
}

export interface State {
    rooms: Room[];
}

const defaultState: State = {
    rooms: [],
};

const logger = (store: any) => (next: any) => (action: any) => {
    console.log('dispatching', action)
    let result = next(action)
    console.log('next state', store.getState())
    return result
}

const handleAddHostToRoom = (state: State, action: AddHostToRoomAction): State => {
    const transform = {
        rooms: (rooms: Room[]): Room[] => {
            return rooms.map(room => {
                if (room.roomId === action.roomId) {
                    return ({
                        ...room,
                        hostSocketId: action.socketId,
                    })
                } else {
                    return room;
                }
            });
        }
    };
    return evolve(transform, state);
};



const handleRemoveRoom = (state: State, action: RemoveRoomAction): State => (
    {
        ...state,
        rooms: state.rooms.filter((room: Room) => room.roomId === action.roomId),
    }
);

const handleAddRoomWithSessionId = (state: State, action: AddRoomWithSessionIdAction): State => {
    if (!state.rooms.filter(room => room.roomId === action.roomId).length) {
        const transform = {
            rooms: (rooms: Room[]): Room[] => [{ roomId: action.roomId, sessionId: action.sessionId }]
        };
        return evolve(transform, state);
    } else {
        const transform = {
            rooms: (rooms: Room[]): Room[] => {
                return rooms.map(room => {
                    if (room.roomId === action.roomId) {
                        return ({
                            ...room,
                            sessionId: action.sessionId,
                        })
                    } else {
                        return room;
                    }
                });
            }
        };
        return evolve(transform, state);
    }
};

const handleAddRoomWithHostSocketId = (state: State, action: AddRoomWithHostSocketIdAction): State => {
    console.log('handleAddRoomWithHostSocketId');
    console.log('**: ', !state.rooms.filter(room => room.roomId === action.roomId).length);
    if (!state.rooms.filter(room => room.roomId === action.roomId).length) {
        const transform = {
            rooms: (rooms: Room[]): Room[] => [{ roomId: action.roomId, hostSocketId: action.socketId }]
        };
        return evolve(transform, state);
    } else {
        const transform = {
            rooms: (rooms: Room[]): Room[] => {
                return rooms.map(room => {
                    if (room.roomId === action.roomId) {
                        return ({
                            ...room,
                            hostSocketId: action.socketId,
                        })
                    } else {
                        return room;
                    }
                });
            }
        };
        return evolve(transform, state);
    }
};


function state(state = defaultState, action: Action) {
    switch (action.type) {
        case 'ADD_ROOM_WITH_SESSION_ID':
            return handleAddRoomWithSessionId(state, action);
        case 'ADD_ROOM_WITH_HOST_SOCKET_ID':
            return handleAddRoomWithHostSocketId(state, action);
        case 'REMOVE_ROOM':
            return handleRemoveRoom(state, action);
        case 'ADD_HOST_TO_ROOM':
            return handleAddHostToRoom(state, action);
        default:
            return state
    }
}

export const store = createStore(state, applyMiddleware(logger));

//store.subscribe(() => console.log(store.getState()));

export default store;
