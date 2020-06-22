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

import { getPeerConnectionById } from "./webRTCHelpers";

describe('getPeerConnectionById', () => {
    it('should return the correct peer connection',  () => {
        //Arrange
        const peerConnections = [{
            connectionId: 'id'
        }];

        //Act
        const result = getPeerConnectionById(peerConnections, 'id');

        //Assert
        expect(result.connectionId).toEqual('id');
    });

    it.todo('should return undefined if id not found');
});

describe('removePeerConnectionById', () => {
    it.todo('should remove a PeerConnection from a PeerConnections array with a given id');
});


describe('stop', () => {
    it.todo('should close the dataChannel on the specified peer connection');

    it.todo('should close the specified peer connection');

    it.todo('should remove the specified peerConnection from the peerConnections array');
});
