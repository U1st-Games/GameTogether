type AddRoomActionType = 'ADD_ROOM';
type RemoveRoomActionType = 'REMOVE_ROOM';
type ActionType = AddRoomActionType
    | RemoveRoomActionType;

interface BaseAction {
    type: ActionType;
}

export interface AddRoomAction extends BaseAction {
    type: 'ADD_ROOM';
    roomId: string;
    sessionId: string;
};

export interface RemoveRoomAction extends BaseAction {
    type: 'REMOVE_ROOM';
    roomId: string;
};

export type Action = AddRoomAction
    | RemoveRoomAction;

export const addRoomAction = (roomId: string, sessionId: string): AddRoomAction => ({
    type: 'ADD_ROOM',
    roomId,
    sessionId,
});

export const removeRoomAction = (roomId: string): RemoveRoomAction => ({
    type: 'REMOVE_ROOM',
    roomId,
});
