import { createStore } from 'redux'
import {Action, AddRoomAction, RemoveRoomAction} from "./actions";

export interface Room {
    roomId: string;
    sessionId: string;
}

interface State {
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
