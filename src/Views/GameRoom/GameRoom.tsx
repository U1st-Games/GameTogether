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
import React, {useEffect, useState} from 'react';
import useOpenTok from 'react-use-opentok';
import styled from 'styled-components';
import {
    Route,
    Switch,
    useParams,
} from "react-router-dom";

import Home from '../Home';
import GameView from './GameView';
import Controls from '../../Components/Controls/Controls';
import Me from './Me';
import OtherParticipants from "./OtherParticipants/OtherParticipants";
import FullScreenView from "./FullScreenView/FullScreenView";

var apiKey = "46617242";
var sessionId = "1_MX40NjYxNzI0Mn5-MTU4NTI3ODQ1MTU3NH43Rm84SWRBbkN2QWh5dkUyUGJMZWlPTE1-fg";
var token = "T1==cGFydG5lcl9pZD00NjYxNzI0MiZzaWc9NGFmMGJlNWJhYWExYjMxNDZhZWQwNDFlZGE4YjFiYjQ1ZjA0ZDIxODpzZXNzaW9uX2lkPTFfTVg0ME5qWXhOekkwTW41LU1UVTROVEkzT0RRMU1UVTNOSDQzUm04NFNXUkJia04yUVdoNWRrVXlVR0pNWldsUFRFMS1mZyZjcmVhdGVfdGltZT0xNTkwNTQ0OTI4Jm5vbmNlPTAuMDI4NzU2MTc1MjU4MTc2NDImcm9sZT1wdWJsaXNoZXImZXhwaXJlX3RpbWU9MTU5MzEzNjkyNyZpbml0aWFsX2xheW91dF9jbGFzc19saXN0PQ==";


const Container = styled.div`
    width: 100vw;
    height: calc(100% - 64px);
    display: flex;
    overflow: hidden;
`;

const MainArea = styled.div`
    flex: 1;
    position: relative;
`;

const SideBar = styled.div`
    width: 300px;
    position: relative;
`;

const Mouse = styled.img`
    position: fixed;
    top: 0;
    left: 0;
    width: 20px;
`;

const GameRoom = () => {
    const {roomid} = useParams();
    const [fullScreenStreamId, setFullScreenStreamId] = useState('');

    const [opentokProps, opentokMethods] = useOpenTok();
    const {
        // connection info
        isSessionInitialized,
        connectionId,
        isSessionConnected,

        // connected data
        session,
        connections,
        streams,
        subscribers,
        publisher,
    } = opentokProps;
    const {
        initSessionAndConnect,
        disconnectSession,
        publish,
        unpublish,
        subscribe,
        unsubscribe,
        sendSignal,
    } = opentokMethods;

    useEffect(() => {
        initSessionAndConnect({
            apiKey,
            sessionId,
            token,
        });
    }, [initSessionAndConnect]);

    return (
        <Container>
            <MainArea>
                <Switch>
                    <Route exact path="/:roomid">
                        <Home roomid={roomid}/>
                    </Route>
                    <Route exact path="/:roomid/:gamename/">
                        <GameView/>
                    </Route>
                </Switch>
                {fullScreenStreamId
                && <FullScreenView
                    streamId={fullScreenStreamId}
                    subscribe={subscribe}
                    streams={streams}
                    setFullScreenStreamId={setFullScreenStreamId}
                />
                }
                <Controls/>
            </MainArea>
            <SideBar>
                <Me {...{publish}} />
                <OtherParticipants {...{streams, publisher, subscribe, setFullScreenStreamId}} />
            </SideBar>
            <Mouse src="/mouse.png" id="remoteCursor"/>
        </Container>
    );
};

export default GameRoom;
