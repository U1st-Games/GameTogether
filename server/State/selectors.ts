import store, { State } from './state';

export const selectRoomById = (roomId: string) =>
    store.getState().rooms.find(room => room.roomId == roomId);
