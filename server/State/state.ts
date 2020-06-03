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

import { createStore } from 'redux'
import {Action, AddRoomAction, RemoveRoomAction} from "./actions";

export interface Room {
    roomId: string;
    sessionId: string;
}

export interface State {
    rooms: Room[];
}

const defaultState: State = {
    rooms: [],
};

const handleAddRoom = (state: State, action: AddRoomAction): State => (
    {
        ...state,
        rooms: [...state.rooms, { roomId: action.roomId, sessionId: action.sessionId }],
    }
);

const handleRemoveRoom = (state: State, action: RemoveRoomAction): State => (
    {
        ...state,
        rooms: state.rooms.filter((room: Room) => room.roomId === action.roomId),
    }
);

function state(state = defaultState, action: Action) {
    switch (action.type) {
        case 'ADD_ROOM':
            return handleAddRoom(state, action);
        case 'REMOVE_ROOM':
            return handleRemoveRoom(state, action);
        default:
            return state
    }
}

export const store = createStore(state);

store.subscribe(() => console.log(store.getState()));

export default store;
