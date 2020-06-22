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

import React from 'react';
import {useParams, Prompt} from "react-router-dom";

import useWebRTCCanvasShare from "../../Hooks/UseWebRTCCanvasShare/useWebRTCCanvasShare";

const GameView = () => {
    const {gamename, roomid} = useParams();

    const {isGuest} = useWebRTCCanvasShare(
        'gameIframe',
        'remoteCursor',
        'remoteVideo',
        undefined,
        roomid,
    );

    return (
        <>
            <Prompt message={() => {
                return 'Are you sure you want to leave the game?';
            }}
            />
            <iframe
                id={'gameIframe'}
                src={`/${gamename}/index.html`} width={"100%"} height={"100%"}
                style={{display: isGuest ? 'none' : 'initial', border: 'none'}}
            />
            <video id={"remoteVideo"} autoPlay muted playsInline/>
        </>
    );
};

export default GameView;
