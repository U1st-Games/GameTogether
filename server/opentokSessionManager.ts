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

//const opentok = new OpenTok(apiKey, apiSecret);

type SessionId = string;

export const createSession = () => {
    // opentok.createSession(function(err, session) {
    //     if (err) return console.log(err);
    //
    //     // save the sessionId
    //     db.save('session', session.sessionId, done);
    // });
};

export const getSessionByRoomId = (roomId: string) => {

};
