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

export const getPeerConnectionById = (
    peerConnections: PeerConnection[],
    peerConnectionId: string
) => {
    return peerConnections.find(pc => pc.connectionId === peerConnectionId);
};

export const removePeerConnectionById = (
    peerConnections: PeerConnection[],
    peerConnectionId: string
) => {
    peerConnections = peerConnections.filter(pc => pc.connectionId !== peerConnectionId);
};

export const stop = (connectionId: string, peerConnections: PeerConnection[]) => {
    const peerConnection = getPeerConnectionById(peerConnections, connectionId);
    if (!peerConnection) {
        console.error('no peer connection');
        return;
    }
    peerConnection.dataChannel.close();
    peerConnection.close();
    removePeerConnectionById(peerConnections, connectionId);
};
