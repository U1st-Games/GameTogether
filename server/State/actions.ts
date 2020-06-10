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

type AddRoomWithSessionIdActionType = 'ADD_ROOM_WITH_SESSION_ID';
type AddRoomWithHostSocketIdActionType = 'ADD_ROOM_WITH_HOST_SOCKET_ID';
type RemoveRoomActionType = 'REMOVE_ROOM';
type AddHostToRoomRoomActionType = 'ADD_HOST_TO_ROOM';
type ActionType = AddRoomWithSessionIdActionType
    | AddRoomWithHostSocketIdActionType
    | RemoveRoomActionType
    | AddHostToRoomRoomActionType;

interface BaseAction {
    type: ActionType;
}

export interface AddRoomWithSessionIdAction extends BaseAction {
    type: 'ADD_ROOM_WITH_SESSION_ID';
    roomId: string;
    sessionId: string;
};

export interface AddRoomWithHostSocketIdAction extends BaseAction {
    type: 'ADD_ROOM_WITH_HOST_SOCKET_ID';
    roomId: string;
    socketId: string;
};

export interface RemoveRoomAction extends BaseAction {
    type: 'REMOVE_ROOM';
    roomId: string;
};

export interface AddHostToRoomAction extends BaseAction {
    type: 'ADD_HOST_TO_ROOM';
    roomId: string;
    socketId: string;
};

export type Action = AddRoomWithSessionIdAction
    | AddRoomWithHostSocketIdAction
    | RemoveRoomAction
    | AddHostToRoomAction;

export const addHostToRoomAction = (roomId: string, socketId: string): AddHostToRoomAction => ({
    type: 'ADD_HOST_TO_ROOM',
    roomId,
    socketId,
});

export const addRoomWithSessionIdAction = (roomId: string, sessionId: string): AddRoomWithSessionIdAction => ({
    type: 'ADD_ROOM_WITH_SESSION_ID',
    roomId,
    sessionId,
});

export const addRoomWithHostSocketIdAction = (roomId: string, socketId: string): AddRoomWithHostSocketIdAction => ({
    type: 'ADD_ROOM_WITH_HOST_SOCKET_ID',
    roomId,
    socketId,
});

export const removeRoomAction = (roomId: string): RemoveRoomAction => ({
    type: 'REMOVE_ROOM',
    roomId,
});
