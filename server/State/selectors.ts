import store, {Room, State} from './state';

export const selectRoomById = (roomId: string) =>
    store.getState().rooms.find((room: Room) => room.roomId == roomId);

export const isHost = (socketId: string) =>{
    return !!store.getState().rooms.find((room: Room) => room.hostSocketId === socketId);
}

